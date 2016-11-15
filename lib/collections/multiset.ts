import AbstractCollection from './abstractcollection';

/**
 * A collection that supports order-independent equality, like a Set, but
 * may have duplicate elements. A multiset is also sometimes called a
 * _bag_.
 * @param T The element type
 */
abstract class Multiset<T> extends AbstractCollection<T> {

  /**
   * Returns the number of occurrences of an element in this multiset.
   *
   * @param item The element to count occurrences of
   * @returns The number of occurrences of the element in this multiset, zero if is not
   * in this multiset
   */
  public abstract count(item: T): number;

  /**
   * Adds or removes the necessary occurrences of an element such that the
   * element attains the desired count.
   * @param item The item to add or remove
   * @param occurrences The number of items to add or remove
   */
  public abstract setCount(item: T, occurrences: number): void;

  /**
   * Returns the set of distinct elements contained in this multiset. The
   * element set is backed by the same data as the multiset, so any change to
   * either is immediately reflected in the other. The order of the elements in
   * the element set is unspecified.
   * @returns A set containing the distinct items in this multiset
   */
  public abstract elementSet(): Set<T>;

  /**
   * Iterator over the collection's elements and number of occurrences
   */
  public abstract entries(): IterableIterator<T>;
}

export default Multiset;
