import Collection from './collection';

/**
 * A collection that supports order-independent equality, like a Set, but
 * may have duplicate elements. A multiset is also sometimes called a
 * _bag_.
 * @param T The element type
 */
interface Multiset<T> extends Collection<[T, number]> {
  
  /**
   * Returns the number of occurrences of an element in this multiset.
   *
   * @param item The element to count occurrences of
   * @returns The number of occurrences of the element in this multiset, zero if is not
   * in this multiset
   */
  count(item: T): number;

  /**
   * Adds a number of occurrences of an element to this multiset. Note that if
   * `occurrences == 1`, this method has the identical effect to {@link
   * Multiset.add(Object)}.
   * @param item The item to insert
   * @param occurrences The number of items to insert
   * @returns 
   **/
  addMulti(item: T, occurrences: number): this;

  /**
   * Deletes a number of occurrences of an element to this multiset. Note that if
   * `occurrences == 1`, this method has the identical effect to {@link
   * Multiset.delete(Object)}.
   * @param item The item to delete
   * @param occurrences The number of items to delete
   * @returns True if at least one lement was deleted, false otherwise
   **/
  deleteMulti(item: T, occurrences: number): boolean;

  /**
   * Adds or removes the necessary occurrences of an element such that the
   * element attains the desired count.
   * @param item The item to add or remove
   * @param occurrences The number of items to add or remove
   **/
  setCount(item: T, occurrences: number): void;

  /**
   * Returns the set of distinct elements contained in this multiset. The
   * element set is backed by the same data as the multiset, so any change to
   * either is immediately reflected in the other. The order of the elements in
   * the element set is unspecified.
   * 
   * @returns A set containing the distinct items in this multiset
   **/
  elementSet(): Set<T>;

  /**
   * Iterator over the collection's elements and number of occurrences
   */
  entries(): IterableIterator<[T, number]>;
}

export default Multiset;