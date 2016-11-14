import Collection from './collection';

/**
 * A collection that maps keys to values, similar to {@link Map}, but in which
 * each key may be associated with _multiple_ values.
 * 
 * @param K The key type
 * @param V The value type
 */
interface Multimap<K, V> {

  readonly [Symbol.toStringTag]: 'MultiMap';

  /**
   * The size (number of entries) in the map.
   */
  size: number;

  /**
   * Returns a view of this multimap as a {@link Map} from each distinct key
   * to the nonempty collection of that key's associated values. Note that
   * `this.asMap().get(k)` is equivalent to `this.get(k)` only when
   * `k` is a key contained in the multimap; otherwise it returns `null` 
   * as opposed to an empty collection.
   *
   * Changes to the returned map or the collections that serve as its values
   * will update the underlying multimap, and vice versa.
   */
  asMap(): Map<K, Array<V> | Collection<V>>;

  _createCollection(): Array<V> | Collection<V>;

  /**
   * Inserts an entry into the map.
   * @param key The key of the entry
   * @param value The value of the entry
   */
  set(key: K, value: V): this;

  /**
   * Removes a single key-value pair with the key `key` and the value
   * `value` from this multimap, if such exists. If multiple key-value
   * pairs in the multimap fit this description, which one is removed is
   * unspecified.
   * @returns True if an entry was deleted, false otherwise
   */
  delete(key: K, value: V): boolean;

  /**
   * Checks if the key exists in the map.
   * @param The key to look up
   * @returns True if it exists, false otherwise
   */
  has(key: K): boolean;

  /**
   * Returns a view collection of the values associated with `key` in this
   * multimap, if any. Note that when `has(key)` is false, this
   * returns an empty collection, not `null`.
   *
   * Changes to the returned collection will update the underlying multimap,
   * and vice versa.
   */
  get(key: K): Array<V> | Collection<V>;

  /**
   * Returns an iterator over the entries of the map.
   * @returns An iterator over the entries
   */
  entries(): IterableIterator<[K, Array<V> | Collection<V>]>;

  /**
   * Returns an iterator over the keys of the map.
   * @returns An iterator over the keys
   */
  keys(): IterableIterator<K>;

  /**
   * Returns an iterator over the values of the map.
   * @returns An iterator over the values
   */
  values(): IterableIterator<Array<V> |Collection<V>>;

  /**
   * Executes the given function once for each entry in the map.
   * @param callbackfn The function to execute
   * @param thisArg Value to use as `this` when executing the call
   */
  forEach(callbackfn: (value: Array<V> |Collection<V>, index: K,
          map: Map<K, Array<V> | Collection<V>>) => void, thisArg?: any): void;

  /**
   * Clears all entries in the map.
   */
  clear(): void;

  /**
   * Returns an iterator over the entries.
   * @returns An iterator
   */
  [Symbol.iterator](): IterableIterator<[K, Array<V> |Collection<V>]>;

}

export default Multimap;
