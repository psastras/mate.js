import Multiset from './multiset';

/**
 * A {@link Multiset} which implements several methods.
 * 
 * @param T The element type
 */
abstract class AbstractMultiset<T> implements Multiset<T> {

  /** @inheritdoc */
  readonly length: number;
  /** @inheritdoc */
  readonly size: number;
  
  /** @inheritdoc */
  abstract count(item: T): number;

  /** @inheritdoc */
  abstract addMulti(item: T, occurrences: number): this;

  /** @inheritdoc */
  add(value: T): this {
    return this.addMulti(value, 1);
  }

  /** @inheritdoc */
  abstract deleteMulti(item: T, occurrences: number): boolean;

  /** @inheritdoc */
  delete(value: [T, number]): boolean {
    return this.deleteMulti(value[0], value[1]);
  }

  /** @inheritdoc */
  has(value: T): boolean {
    return this.count(value) > 0;
  }

  /** @inheritdoc */
  setCount(item: T, occurrences: number): void {
    if (occurrences < 1) throw new Error(`attempted to insert ${occurrences} items which is < 1`);
    if (!this.has(item)) {
      this.addMulti(item, occurrences);
    } else {
      const count = this.count(item);
      if (occurrences > count) {
        this.addMulti(item, occurrences - count);
      } else if (occurrences < count) {
        this.deleteMulti(item, count - occurrences);
      } else {
        this.deleteMulti(item, count);
      }
    }
  }

  /** @inheritdoc */
  abstract elementSet(): Set<T>;

  /** @inheritdoc */
  abstract clear(): void;
  
  /** @inheritdoc */
  forEach(callbackfn: (value: [T, number], index: T, set: Multiset<T>) => void, thisArg?: Multiset<T>): void {
    const set = (thisArg || this)
    for (let entry of set.entries()) {
      callbackfn(entry, entry[0], set);
    }
  }
  
  /** @inheritdoc */
  push(value: [T, number]): number {
    this.add(value[0]);
    return this.size;
  }

  /** @inheritdoc */
  abstract entries(): IterableIterator<[T, number]>;

  /** @inheritdoc */
  [Symbol.iterator](): IterableIterator<[T, number]> {
    return this.entries();
  }
}

export default AbstractMultiset;