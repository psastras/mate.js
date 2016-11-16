import ImmutableCollection from './immutablecollection';

/**
 * A {@link Set} which is immutable after construction.  An {@link Error} will be
 * thrown if an attempt is made to modify this set.
 * 
 * Example usage
 * ```
 * const set = new ImmutableSet<string>(
 *   'foo', 'bar
 * );
 * 
 * set.has('foo'); // true
 * 
 * // the set cannot be modified
 * set.delete('foo'); // throw new Error
 * set.clear(); // throw new Error
 * 
 * ```
 * 
 * @param T The entry type
 */
class ImmutableSet<T> extends ImmutableCollection<T> implements Set<T> {

  public readonly [Symbol.toStringTag]: 'Set';
  private readonly set: Set<T>;

  constructor(...items: T[]) {
    super();
    this.set = new Set<T>();
    for (let item of items) {
      this.set.add(item);
    }
  }

  /**
   * The number of elements in the collection.
   */
  get size(): number {
    return this.set.size;
  }

  /** @inheritdoc */
  get length(): number {
    return this.set.size;
  }

  /**
   * Executes the given function once for each entry in the map.
   * @param callbackfn The function to execute
   * @param thisArg Value to use as `this` when executing the call
   */
  public forEach(callbackfn: (value: T, index: T, set: Set<T>) => void, thisArg?: any): void {
    this.set.forEach(callbackfn, thisArg);
  }

  /** @inheritdoc */
  public has(value: T): boolean {
    return this.set.has(value);
  }

  /** @inheritdoc */
  public [Symbol.iterator](): IterableIterator<T> {
    return this.set[Symbol.iterator]();
  }

  /**
   * Returns an iterator over the entries of the set.
   * @returns An iterator over the entries
   */
  public entries(): IterableIterator<[T, T]> {
    return this.set.entries();
  }

  /**
   * Returns an iterator over the keys of the set.
   * @returns An iterator over the keys
   */
  public keys(): IterableIterator<T> {
    return this.set.keys();
  }

  /**
   * Returns an iterator over the values of the set.
   * @returns An iterator over the values
   */
  public values(): IterableIterator<T> {
    return this.set.values();
  }
}

export default ImmutableSet;
