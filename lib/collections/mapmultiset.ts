import AbstractMultiset from './abstractmultiset';

/**
 * Basic implementation of {@link Multiset} backed by an instance of
 * `Map<T, number>`.
 * 
 * Example usage
 * ```
 * const set = new MapMultiset<string>()
 *  .add('foo')
 *  .add('foo');
 * 
 * set.count('foo'); // 2
 * 
 * set.addMulti('bar', 3);
 * set.count('bar'); // 3
 * 
 * set.length; // 2
 * set.size; // 5
 * ```
 * 
 * @param T The element type
 */
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
  public count(item: T): number {
    return this.map.get(item) || 0;
  }

  /** @inheritdoc */
  public addMulti(item: T, occurrences: number = 1): this {
    if (occurrences < 1) {
      throw new Error(`attempted to insert ${occurrences} items which is < 1`);
    }
    this.map.set(item, this.count(item) + occurrences);
    this._size += occurrences;
    return this;
  }

  /** @inheritdoc */
  public deleteMulti(item: T, occurrences: number = 1): boolean {
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
  public elementSet(): Set<T> {
    return new Set<T>(this.map.keys());
  }

  /** @inheritdoc */
  public clear(): void {
    this.map.clear();
    this._size = 0;
  }

  /** @inheritdoc */
  public entries(): IterableIterator<[T, number]> {
    return this.map.entries();
  }
}

export default MapMultiset;
