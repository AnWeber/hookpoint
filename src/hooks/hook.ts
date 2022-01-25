import { HookCancel, HookInterceptor, HookItem, HookTriggerContext } from '../models';

export abstract class Hook<TArgs extends unknown[], TReturn, TResult> {
  #items: Array<HookItem<TArgs, TReturn>>;
  #interceptors: Array<HookInterceptor<TArgs, TReturn>>;

  get interceptors(): ReadonlyArray<HookInterceptor<TArgs, TReturn>> {
    return this.#interceptors;
  }

  get items(): ReadonlyArray<HookItem<TArgs, TReturn>> {
    return this.#items;
  }

  id: string;

  constructor(protected readonly bailOut?: ((arg: TReturn) => boolean) | undefined) {
    this.id = this.constructor.name;
    this.#items = [];
    this.#interceptors = [];
  }

  hasHook(id: string) {
    return this.#items.some(obj => obj.id === id);
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
    if (item.before) {
      const index = Math.min(...this.getIndices(item.before));
      if (index >= 0) {
        this.#items.splice(index, 0, item);
        return;
      }
    }
    if (item.after) {
      const index = Math.max(...this.getIndices(item.after));
      if (index >= 0) {
        this.#items.splice(index + 1, 0, item);
        return;
      }
    }
    this.#items.push(item);
  }

  addObjHook<TObj extends Omit<HookItem<TArgs, TReturn>, 'action'>>(
    getAction: (obj: TObj) => (...args: TArgs) => Promise<TReturn | typeof HookCancel>,
    ...objs: TObj[]
  ): void {
    for (const obj of objs) {
      const action = getAction(obj);
      this.addHook(obj.id, (...args: TArgs) => action.call(obj, ...args), obj);
    }
  }

  private getIndices(ids: Array<string>) {
    return ids.map(before => this.#items.findIndex(obj => obj.id === before)).filter(obj => obj >= 0);
  }

  removeHook(id: string): boolean {
    const index = this.#items.findIndex(obj => obj.id === id);
    if (index >= 0) {
      this.#items.splice(index, 1);
      return true;
    }
    return false;
  }

  addInterceptor(interceptor: HookInterceptor<TArgs, TReturn>): void {
    this.#interceptors.push(interceptor);
  }
  removeInterceptor(interceptor: HookInterceptor<TArgs, TReturn>): boolean {
    const index = this.#interceptors.indexOf(interceptor);
    if (index >= 0) {
      this.#interceptors.splice(index, 1);
      return true;
    }
    return false;
  }

  async trigger(...args: TArgs): Promise<TResult | typeof HookCancel> {
    const results: TReturn[] = [];
    const context: HookTriggerContext<TArgs, TReturn> = {
      index: 0,
      length: this.#items.length,
      arg: args[0],
      args,
    };

    if ((await this.intercept(obj => obj.beforeLoop, context)) === false) {
      return HookCancel;
    }

    while (context.index < context.length) {
      context.hookItem = this.#items[context.index];
      if ((await this.intercept(obj => obj.beforeTrigger, context)) === false) {
        return HookCancel;
      }
      const result = await context.hookItem.action(...context.args);
      if (result === HookCancel) {
        return HookCancel;
      }
      if (this.bailOut && this.bailOut(result)) {
        results.push(result);
        return this.getMergedResults(results, context.args);
      }
      results.push(result);
      context.args = this.getNextArgs(result, context.args);

      if ((await this.intercept(obj => obj.afterTrigger, context)) === false) {
        return HookCancel;
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
    for (const interceptor of this.#interceptors) {
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

  merge(hook: Hook<TArgs, TReturn, TResult>) {
    const result = this.initNew();
    result.#items.push(...this.#items);
    result.#items.push(...hook.#items);
    result.#interceptors.push(...this.#interceptors);
    result.#interceptors.push(...hook.#interceptors);
    return result;
  }

  protected abstract getNextArgs(next: TReturn, args: TArgs): TArgs;

  protected abstract getMergedResults(results: TReturn[], args: TArgs): TResult;

  protected abstract initNew(): Hook<TArgs, TReturn, TResult>;
}
