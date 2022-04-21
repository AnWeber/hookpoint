import { HookCancel } from './hookCancel';
import { HookInterceptor } from './hookInterceptor';
import { HookItem } from './hookItem';

export interface IHook<TArgs extends unknown[], TReturn, TResult> {
  id: string;
  get interceptors(): ReadonlyArray<HookInterceptor<TArgs, TReturn>>;
  get items(): ReadonlyArray<HookItem<TArgs, TReturn>>;
  trigger(...args: TArgs): Promise<TResult | typeof HookCancel>;
}
