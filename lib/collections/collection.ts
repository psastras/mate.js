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
   * Ensures that this collection contains the specified element 
   * @param item Element to add
   * @returns The collection
   */
  add(item: T): this;

  /**
   * Removes a single instance of the specified element from this collection, if it is present.
   */
  delete(item: T): boolean;

  /**
   * Iterator over the collection's elements
   */
  [Symbol.iterator](): IterableIterator<T>;

  /**
   * Iterator over the collection's elements
   */
  entries(): IterableIterator<T>;
}

export default Collection;
