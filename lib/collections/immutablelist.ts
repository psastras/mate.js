import ImmutableCollection from './immutablecollection';

/**
 * A  List which is immutable after construction.  An {@link Error} will be
 * thrown if an attempt is made to modify this list.
 * 
 * Example usage
 * ```
 * const list = new ImmutableList<string>(
 *   'foo', 'bar
 * );
 * 
 * list.has('foo'); // true
 * 
 * // the list cannot be modified
 * list.delete('foo'); // throw new Error
 * list.clear(); // throw new Error
 * 
 * ```
 * 
 * @param T The entry type
 */
class ImmutableList<T> extends ImmutableCollection<T> {

  private readonly array: Array<T>;

  constructor(...items: T[]) {
    super();
    this.array = new Array<T>();
    for (let item of items) {
      this.array.push(item);
    }
  }

  /** @inheritdoc */
  public get length(): number {
    return this.array.length;
  }

  /**
   * Retrieves the element in the list at a given position.
   * @param index The index of the element to retrieve, should be less than the length of the list.
   * @returns The element stored at that position
   */
  public get(index: number): T {
    return this.array[index];
  }

  /** @inheritdoc */
  public [Symbol.iterator]() {
    return this.array[Symbol.iterator]();
  }

  /** @inheritdoc */
  public has(item: T): boolean {
    return this.array.indexOf(item) !== -1;
  }

}

export default ImmutableList;
