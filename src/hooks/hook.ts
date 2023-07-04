import { IHook, HookCancel, HookInterceptor, HookItem, HookTriggerContext } from '../models';
import { SortSet } from './sortSet';

export abstract class Hook<TArgs extends unknown[], TReturn, TResult> implements IHook<TArgs, TReturn, TResult> {
  #items: SortSet<HookItem<TArgs, TReturn>>;
  #interceptors: SortSet<HookInterceptor<TArgs, TReturn>>;

  get interceptors(): ReadonlyArray<HookInterceptor<TArgs, TReturn>> {
    return [...this.#interceptors.sorted];
  }

  get items(): ReadonlyArray<HookItem<TArgs, TReturn>> {
    return [...this.#items.sorted];
  }

  id: string;

  constructor(protected readonly bailOut?: ((arg: TReturn) => boolean) | undefined) {
    this.id = this.constructor.name;
    this.#items = new SortSet();
    this.#interceptors = new SortSet();
  }

  hasHook(id: string) {
    return this.#items.hasItem(id);
  }

  addHook(
    id: string,
    action: (...args: TArgs) => TReturn | typeof HookCancel | Promise<TReturn | typeof HookCancel>,
    options?: {
      before?: Array<string>;
      after?: Array<string>;
    }
  ): void {
    const item = {
      ...options,
      id,
      action,
    };
    this.#items.add(item);
  }

  addObjHook<TObj extends Omit<HookItem<TArgs, TReturn>, 'action'>>(
    getAction: (obj: TObj) => (...args: TArgs) => Promise<TReturn | typeof HookCancel>,
    ...objs: TObj[]
  ): void {
    this.#items.add(
      ...objs.map(obj => ({
        ...obj,
        id: obj.id,
        action: (...args: TArgs) => getAction(obj).call(obj, ...args),
      }))
    );
  }

  removeHook(id: string): boolean {
    return this.#items.remove(id);
  }

  addInterceptor(interceptor: HookInterceptor<TArgs, TReturn>): void {
    this.#interceptors.add(interceptor);
  }
  removeInterceptor(id: string): boolean {
    return this.#interceptors.remove(id);
  }

  async trigger(...args: TArgs): Promise<TResult | typeof HookCancel> {
    const results: TReturn[] = [];
    const context: HookTriggerContext<TArgs, TReturn> = {
      index: 0,
      length: this.#items.sorted.length,
      args,
      results,
      hook: this,
    };

    if ((await this.intercept(obj => obj.beforeLoop, context)) === false) {
      return HookCancel;
    }
    if (context.bail) {
      return this.getMergedResults(results, context.args);
    }

    while (context.index < context.length) {
      context.hookItem = this.#items.sorted[context.index];
      if ((await this.intercept(obj => obj.beforeTrigger, context)) === false) {
        return HookCancel;
      }
      if (context.bail) {
        return this.getMergedResults(results, context.args);
      }
      const result = await context.hookItem.action(...context.args);
      if (result === HookCancel) {
        return HookCancel;
      }
      results.push(result);

      context.args = this.getNextArgs(result, context.args);
      if ((await this.intercept(obj => obj.afterTrigger, context)) === false) {
        return HookCancel;
      }
      if (context.bail || (this.bailOut && this.bailOut(result))) {
        return this.getMergedResults(results, context.args);
      }
      context.index++;
    }
    if ((await this.intercept(obj => obj.afterLoop, context)) === false) {
      return HookCancel;
    }
    return this.getMergedResults(results, context.args);
  }

  private async intercept(
    method: (
      interceptor: HookInterceptor<TArgs, TReturn>
    ) => ((context: HookTriggerContext<TArgs, TReturn>) => Promise<boolean | void>) | undefined,
    context: HookTriggerContext<TArgs, TReturn>
  ) {
    for (const interceptor of this.#interceptors.sorted) {
      const event = method(interceptor);
      if (event) {
        const result = await event.apply(interceptor, [context]);
        if (!result) {
          return false;
        }
      }
    }
    return true;
  }

  merge(...hooks: Array<Hook<TArgs, TReturn, TResult>>) {
    const result = this.initNew();
    result.#items.addSortSet(this.#items);
    result.#interceptors.addSortSet(this.#interceptors);
    for (const hook of hooks) {
      result.#items.addSortSet(hook.#items);
      result.#interceptors.addSortSet(hook.#interceptors);
    }
    return result;
  }

  protected abstract getNextArgs(next: TReturn, args: TArgs): TArgs;

  protected abstract getMergedResults(results: TReturn[], args: TArgs): TResult;

  protected abstract initNew(): Hook<TArgs, TReturn, TResult>;
}
