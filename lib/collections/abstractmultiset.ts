import Multiset from './multiset';

/**
 * A {@link Multiset} which implements several methods.
 * 
 * @param T The element type
 */
abstract class AbstractMultiset<T> extends Multiset<T> {

  /**
   * The total number of _unique_ items in the {@link Multiset}.
   */
  public readonly length: number;

  /**
   * The total number of items in the {@link Multiset}.
   */
  public readonly size: number;

  /** @inheritdoc */
  public abstract count(item: T): number;

  /**
   * Adds a number of occurrences of an element to this multiset.
   * 
   * @param value The item to insert and the number of times to insert it
   * @returns The multiset
   */
  public abstract add(value: T, occurrences?: number): this;

  /**
   * Removes a number of occurrences of an element from this multiset.
   * 
   * @param value The item to insert and the number of times to remove it
   * @returns The multiset
   */
  public abstract delete(value: T, occurrences?: number): boolean;

  /**
   * Checks if the {@link Multiset} contains the given item.
   * 
   * @param value The item to look for
   * @returns True if the item is contained, false otherwise
   */
  public has(value: T): boolean {
    return this.count(value) > 0;
  }

  /** @inheritdoc */
  public setCount(item: T, occurrences: number): void {
    if (occurrences < 1) {
      throw new Error(`attempted to insert ${occurrences} items which is < 1`);
    }
    if (!this.has(item)) {
      this.add(item, occurrences);
    } else {
      const count = this.count(item);
      if (occurrences > count) {
        this.add(item, occurrences - count);
      } else {
        this.delete(item, count - occurrences);
      }
    }
  }

  /** @inheritdoc */
  public abstract elementSet(): Set<T>;

  /**
   * Removes all items from the {@link Multiset}.
   */
  public abstract clear(): void;

  /** @inheritdoc */
  public forEach(callbackfn: (value: T, index: T, set: Multiset<T>) => void,
                 thisArg?: Multiset<T>): void {
    const set = (thisArg || this);
    for (let entry of set) {
      callbackfn(entry, entry[0], set);
    }
  }

  /** @inheritdoc */
  public abstract [Symbol.iterator](): IterableIterator<T>;
}

export default AbstractMultiset;
