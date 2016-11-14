import AbstractMultiset from './abstractmultiset';

/**
 * Basic implementation of {@link Multiset} backed by an instance of
 * `Map<T, number>`.
 **/
class MapMultiset<T> extends AbstractMultiset<T> {
  
  private map: Map<T, number>;
  private _size: number;
  
  constructor() {
    super();
    this.map = new Map<T, number>();
    this._size = 0;
  }

  /** @inheritdoc */
  get size(): number {
    return this._size;
  }

  /** @inheritdoc */
  get length(): number {
    return this.map.size;
  }

  /** @inheritdoc */
  count(item: T): number {
    return this.map.get(item) || 0;
  }

  /** @inheritdoc */
  addMulti(item: T, occurrences: number = 1): this {
    if (occurrences < 1) throw new Error(`attempted to insert ${occurrences} items which is < 1`);
    this.map.set(item, this.count(item) + occurrences);
    this._size += occurrences;
    return this;
  }

  /** @inheritdoc */
  deleteMulti(item: T, occurrences: number = 1): boolean {
    const oldCount = this.count(item);
    const newCount = oldCount - occurrences;
    if (newCount > 0) {
      this.map.set(item, newCount);
    } else {
      this.map.delete(item);
    }
    const numDeleted = oldCount - Math.max(newCount, 0);
    this._size -= numDeleted;
    return numDeleted > 0;
  }

  /** @inheritdoc */
  elementSet(): Set<T> {
    return new Set<T>(this.map.keys());
  }

  /** @inheritdoc */
  clear(): void {
    this.map.clear();
    this._size = 0;
  }

  /** @inheritdoc */
  entries(): IterableIterator<[T, number]> {
    return this.map.entries();
  }
}

export default MapMultiset;