import Multiset from './multiset';

/**
 * A {@link Multiset} which implements several methods.
 * 
 * @param T The element type
 */
abstract class AbstractMultiset<T> implements Multiset<T> {

  /** @inheritdoc */
  public readonly length: number;
  /** @inheritdoc */
  public readonly size: number;

  /** @inheritdoc */
  public abstract count(item: T): number;

  /** @inheritdoc */
  public abstract addMulti(item: T, occurrences: number): this;

  /** @inheritdoc */
  public add(value: T): this {
    return this.addMulti(value, 1);
  }

  /** @inheritdoc */
  public abstract deleteMulti(item: T, occurrences: number): boolean;

  /** @inheritdoc */
  public delete(value: [T, number]): boolean {
    return this.deleteMulti(value[0], value[1]);
  }

  /** @inheritdoc */
  public has(value: T): boolean {
    return this.count(value) > 0;
  }

  /** @inheritdoc */
  public setCount(item: T, occurrences: number): void {
    if (occurrences < 1) {
      throw new Error(`attempted to insert ${occurrences} items which is < 1`);
    }
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
  public abstract elementSet(): Set<T>;

  /** @inheritdoc */
  public abstract clear(): void;

  /** @inheritdoc */
  public forEach(callbackfn: (value: [T, number], index: T, set: Multiset<T>) => void,
                 thisArg?: Multiset<T>): void {
    const set = (thisArg || this);
    for (let entry of set.entries()) {
      callbackfn(entry, entry[0], set);
    }
  }

  /** @inheritdoc */
  public push(value: [T, number]): number {
    this.add(value[0]);
    return this.size;
  }

  /** @inheritdoc */
  public abstract entries(): IterableIterator<[T, number]>;

  /** @inheritdoc */
  public [Symbol.iterator](): IterableIterator<[T, number]> {
    return this.entries();
  }
}

export default AbstractMultiset;
