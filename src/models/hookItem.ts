import { HookCancel } from './hookCancel';




export interface HookItem<TArgs extends unknown[], TReturn> {
  id: string;
  before?: Array<string>;
  after?: Array<string>;
  action(...args: TArgs): TReturn | typeof HookCancel | Promise<TReturn | typeof HookCancel>;
}