import { HookItem } from './hookItem';
import { HookTriggerContext } from './hookTriggerContext';

export interface HookInterceptor<TArgs extends unknown[], TReturn> {
  id: string;
  before?: Array<string>;
  after?: Array<string>;
  description?: string;
  register?(item: HookItem<TArgs, TReturn>): boolean;
  beforeLoop?(context: HookTriggerContext<TArgs, TReturn>): Promise<boolean | undefined>;
  beforeTrigger?(context: HookTriggerContext<TArgs, TReturn>): Promise<boolean | undefined>;
  afterTrigger?(context: HookTriggerContext<TArgs, TReturn>): Promise<boolean | undefined>;
  afterLoop?(context: HookTriggerContext<TArgs, TReturn>): Promise<boolean | undefined>;
  onError?(err: unknown, context: HookTriggerContext<TArgs, TReturn>): Promise<boolean | undefined>;
}
