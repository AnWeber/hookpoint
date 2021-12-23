import { Hook } from './hook';

export class SeriesHook<TArgs extends unknown[], TReturn> extends Hook<TArgs, TReturn, Array<TReturn>> {
  constructor(bailOut?: ((arg: TReturn) => boolean) | undefined) {
    super(bailOut);
  }
  protected getNextArgs(_next: TReturn, args: TArgs): TArgs {
    return args;
  }

  protected getMergedResults(results: TReturn[]): TReturn[] {
    return results;
  }

  protected initNew() {
    return new SeriesHook<TArgs, TReturn>(this.bailOut);
  }
}
