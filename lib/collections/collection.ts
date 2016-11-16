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
   * Adds all of the elements in the specified collection to this collection
   * @param items Elements to add
   * @returns The collection
   */
  addAll(items: Collection<T>): this;

  /**
   * Removes a single instance of the specified element from this collection, if it is present.
   * @param item Element to dlete
   * @returns True if the collection was modified, false otherwise
   */
  delete(item: T): boolean;

  /**
   * Removes all of this collection's elements that are also contained in the specified collection.
   * @param items Elements to delete
   * @returns The collection
   */
  deleteAll(items: Collection<T>): boolean;

  /**
   * Returns true if this collection contains the specified element.
   * @param item The item to check
   * @returns True if the item is contained, false otherwise
   */
  has(item: T): boolean;

  /**
   * Returns true if this collection contains all of the elements in the specified collection.
   * @param items The items to check for containment
   * @returns True if this collection contains all of the elements in the given collection.  False
   * otherwise
   */
  hasAll(items: Collection<T>): boolean;

  /**
   * Returns true if this collection contains no elements.
   * @returns True if this collection contains no elements, false otherwise.
   */
  isEmpty(): boolean;

  /**
   * Returns an array containing all of the elements in this collection.
   */
  toArray(): Array<T>;

  /**
   * Removes all of the elements from this collection.
   */
  clear(): void;

  /**
   * Iterator over the collection's elements
   */
  [Symbol.iterator](): IterableIterator<T>;

}

export default Collection;
