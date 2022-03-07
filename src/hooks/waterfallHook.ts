import { Hook } from './hook';

export class WaterfallHook<TArgs extends unknown[], TBail = TArgs[0]> extends Hook<
  TArgs,
  TArgs[0] | TBail,
  TArgs[0] | TBail
> {
  constructor(bailOut?: ((arg: TArgs[0] | TBail) => boolean) | undefined) {
    super(bailOut);
  }
  protected getNextArgs(next: TArgs[0], args: TArgs): TArgs {
    args[0] = next;
    return args;
  }

  protected getMergedResults(results: TArgs[0][], args: TArgs): TArgs[0] {
    if (results.length > 0) {
      return results.pop();
    }
    return args[0];
  }
  protected initNew() {
    return new WaterfallHook<TArgs, TBail>(this.bailOut);
  }
}
