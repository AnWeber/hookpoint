
interface SortItem<T>{
  id: string;
  after: Array<SortItem<T>>;
  item: T;
  index?: number;
}

export class SortSet<T extends { id: string, before?: Array<string>, after?: Array<string> }> {
  #items: Array<T>;
  #sortedItems: Array<T> | undefined;

  constructor() {
    this.#items = [];
  }


  hasItem(id: string) {
    return this.#items.some(obj => obj.id === id);
  }

  add(...items: Array<T>) {
    this.#items.push(...items);
    this.#sortedItems = undefined;
  }

  addSortSet(set: SortSet<T>) {
    this.#items.push(...set.#items);
    this.#sortedItems = undefined;
  }
  remove(id: string) {
    const index = this.#items.findIndex(obj => obj.id === id);
    if (index >= 0) {
      this.#items.splice(index, 0);
      this.#sortedItems = undefined;
      return true;
    }
    return false;
  }

  public get sorted() {
    if (!this.#sortedItems) {
      const sortItems = this.calculateIndex(this.prepareSortItems());
      this.#sortedItems = sortItems.sort((obj1, obj2) => {
        if (obj1.index < obj2.index) {
          return -1;
        }
        if (obj1.index > obj2.index) {
          return 1;
        }
        return 0;
      }).map(obj => obj.item);
    }
    return this.#sortedItems;
  }


  private prepareSortItems() {
    const sortItems: Array<SortItem<T>> = [];
    const sortMap: Map<string, SortItem<T>> = new Map(this.#items.map((item => [item.id, { id: item.id, after: [], item }])));

    const beforeItems: Array<SortItem<T>> = [];
    for (const item of this.#items) {
      const sortItem = sortMap.get(item.id);
      if (sortItem) {

        if (item.after) {
          for (const afterId of item.after) {
            const afterItem = sortMap.get(afterId);
            if (afterItem) {
              sortItem.after.push(afterItem)
            }
          }
        }
        if (item.before) {
          beforeItems.push(sortItem);
        } else {
          sortItems.push(sortItem);
        }
      }
    }
    for (const sortItem of beforeItems) {
      const index = [];
      if (sortItem.item.before) {
        for (const beforeId of sortItem.item.before) {
          const beforeItem = sortMap.get(beforeId);
          if (beforeItem) {
            beforeItem.after.splice(0, 0, sortItem);
            index.push(sortItems.findIndex(obj => obj.id === beforeId));
          }
        }
      }
      sortItems.splice(Math.min(...index), 0, sortItem);
    }
    return sortItems;
  }

  private calculateIndex(sortItems: Array<SortItem<T>>) {
    const result: Array<SortItem<T> & { index: number }> = [];
    for (const sortItem of sortItems) {
      result.push({
        ...sortItem,
        index: this.getIndex(sortItem, sortItems)
      });
    }
    return result;
  }

  private getIndex(sortItem: SortItem<T>, sortItems: Array<SortItem<T>>) : number{

    if (typeof sortItem.index === 'undefined') {
      if (sortItem.after.length === 0) {
        sortItem.index = sortItems.indexOf(sortItem) * 2;
      } else {
        sortItem.index = -1;
        const afterIndex = sortItem.after.map(obj => this.getIndex(obj, sortItems))
          .filter(obj => obj >= 0);
        if (afterIndex.length > 0) {
          sortItem.index = Math.max(...afterIndex) + 1;
        }
      }
    }
    return sortItem.index;
  }

}

