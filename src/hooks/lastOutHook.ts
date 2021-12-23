import { Hook } from './hook';

export class LastOutHook<TArgs extends unknown[], TReturn> extends Hook<TArgs, TReturn | undefined, TReturn | undefined> {
  constructor(bailOut?: ((arg: TReturn | undefined) => boolean) | undefined) {
    super(bailOut);
  }
  protected getNextArgs(_next: TReturn | undefined, args: TArgs): TArgs {
    return args;
  }

  protected getMergedResults(results: TReturn[]): TReturn | undefined {
    return results.pop();
  }
  protected initNew() {
    return new LastOutHook<TArgs, TReturn | undefined>(this.bailOut);
  }
}
