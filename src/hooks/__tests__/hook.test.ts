import { Hook } from '../hook';

class TestHook extends Hook<[], boolean, boolean>{
  protected getNextArgs(): [] {
    throw new Error('Method not implemented.');
  }
  protected getMergedResults(): boolean {
    throw new Error('Method not implemented.');
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

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'b','c']);
    });
    it('should not change order if after is used', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true, {
        after: ['a']
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a', 'b','c']);
    });
    it('should change order, if after added before after id', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true, {
        after: ['c']
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a','c','b']);
    });
    it('should change order, if before added after before id', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true);
      hook.addHook('b', () => true, {
        before: ['a']
      });
      hook.addHook('c', () => true, {
        before: ['a']
      });

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b','c','a']);
    });

    it('should change order, if after and before is used in separated hooks', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { after: ['c'] });
      hook.addHook('b', () => true, {
        before: ['a']
      });
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b','c','a']);
    });
    it('should change order, if after and before is used in same hooks', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { after: ['b'], before: ['c']});
      hook.addHook('b', () => true);
      hook.addHook('c', () => true);

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['b','a','c']);
    });
    it('should end sort on infinite loop', async () => {
      const hook = new TestHook();

      hook.addHook('a', () => true, { before: ['b']});
      hook.addHook('b', () => true, { before: ['c']});
      hook.addHook('c', () => true, { before: ['a']});

      expect(hook.items.map(obj => obj.id)).toStrictEqual(['a','b','c']);
    });
  });
});