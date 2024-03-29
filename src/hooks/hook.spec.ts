import { Hook } from './hook';

class TestHook extends Hook<[], boolean, boolean> {
  protected getNextArgs(): [] {
    return [];
  }
  protected getMergedResults(): boolean {
    return true;
  }
  protected initNew(): Hook<[], boolean, boolean> {
    throw new Error('Method not implemented.');
  }
}

describe('hook', () => {
  describe('addHook', () => {
    it('should not change order', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true);
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'b', 'c']);
    });
    it('should not change order if after is used', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true, {
        after: ['a'],
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'b', 'c']);
    });
    it('should change order, if after added before ref id', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, {
        after: ['b'],
      });
      hook.addHook('b', () => true, {
        after: ['c'],
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['c', 'b', 'a']);
    });
    it('should change order, if before added after ref id', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('c', () => true, {
        before: ['a'],
      });
      hook.addHook('b', () => true, {
        before: ['c'],
      });

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b', 'c', 'a']);
    });

    it('should change order, if after and before is used in separated hooks', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { after: ['c'] });
      hook.addHook('b', () => true, {
        before: ['a'],
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b', 'c', 'a']);
    });
    it('should change order, if after and before is used in same hooks', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { after: ['b'], before: ['c'] });
      hook.addHook('b', () => true);
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b', 'a', 'c']);
    });
    it('should change order, if before is added before another item', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { before: ['c'] });
      hook.addHook('b', () => true);
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b', 'a', 'c']);
    });
    it('should change order, if after is added after another item', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true);
      hook.addHook('c', () => true, { after: ['a'] });

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'c', 'b']);
    });
    it('should end sort on infinite loop', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { before: ['b'] });
      hook.addHook('b', () => true, { before: ['c'] });
      hook.addHook('c', () => true, { before: ['a'] });

      expect(hook.items.length).toBe(3);
    });
    it('should change id, if same id is already used', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('a', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'a#1']);
    });
    it('should change id, if empty id is already used', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('', () => true);
      hook.addHook('', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'unknown', 'unknown#1']);
    });
  });
  describe('interceptor', () => {
    it('should add and remove interceptor', async () => {
      const hook = new TestHook();

      const id = 'testInterceptor';
      hook.addInterceptor({ id });
      hook.removeInterceptor(id);

      expect(hook.interceptors.length).toBe(0);
    });
    it('should call interceptor beforeLoop', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => true);
      hook.addHook('b', () => true);

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async beforeLoop() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'beforeLoop');
      hook.addInterceptor(interceptor);

      await hook.trigger();

      expect(spy).toHaveBeenCalledTimes(1);
    });
    it('should call interceptor beforeTrigger', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => true);
      hook.addHook('b', () => true);

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async beforeTrigger() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'beforeTrigger');
      hook.addInterceptor(interceptor);

      await hook.trigger();

      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should call interceptor afterTrigger', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => true);
      hook.addHook('b', () => true);

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async afterTrigger() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'afterTrigger');
      hook.addInterceptor(interceptor);

      await hook.trigger();

      expect(spy).toHaveBeenCalledTimes(2);
    });
    it('should call interceptor afterLoop', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => true);
      hook.addHook('b', () => true);

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async afterLoop() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'afterLoop');
      hook.addInterceptor(interceptor);

      await hook.trigger();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call interceptor afterLoop on bail', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => true);

      hook.addInterceptor({
        id: 'bail',
        async beforeTrigger(context) {
          context.bail = true;
          return true;
        },
      });

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async afterLoop() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'afterLoop');
      hook.addInterceptor(interceptor);

      await hook.trigger();

      expect(spy).toHaveBeenCalledTimes(1);
    });

    it('should call interceptor onError', async () => {
      const hook = new TestHook();
      hook.addHook('a', () => {
        throw new Error();
      });

      const id = 'testInterceptor';

      const interceptor = {
        id,
        async onError() {
          return true;
        },
      };
      const spy = jest.spyOn(interceptor, 'onError');
      hook.addInterceptor(interceptor);

      try {
        await hook.trigger();
      } catch (err) {
        //
      }
      expect(spy).toHaveBeenCalledTimes(1);
    });
  });
});
