interface Collection<T> {

  readonly length: number;

  /**
  * Appends new elements to a collection, and returns the new length of the collection.
  * @param items New elements of the Collection.
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