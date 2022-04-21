import { IHook } from './hook';
import { HookItem } from './hookItem';

export interface HookTriggerContext<TArgs extends unknown[], TReturn, TResult = unknown> {
  index: number;
  length: number;
  arg: TArgs[0];
  args: TArgs;
  hookItem?: HookItem<TArgs, TReturn>;
  results: Array<TReturn>;
  hook: IHook<TArgs, TReturn, TResult>;
}
