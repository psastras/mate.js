/**
 * A Collection describes a group of items.  This is primarily used by other, collection
 * base primitives to allow changing the underlying implementation of backing stores.
 * 
 * @param T The type being stored
 */
interface Collection<T> {

  /**
   * The number of elements in the collection.
   */
  readonly length: number;

  /**
  * Appends new elements to a collection, and returns the new length of the collection.
  * @param items New elements of the collection.
  */
  push(...items: T[]): number;

  /**
  * Removes the last element from an collection and returns it.
  */
  pop(): T | undefined;

  /**
   * Removes a single instance of the specified element from this collection, if it is present.
   */
  delete(...items: T[]): boolean;

}

export default Collection;