import ArrayMultimap from './arrayMultimap';

/**
 * A {@link Multimap} backed by arrays storing multiple values per key.  Iteration
 * order is maintained for each value in a key.  Adding multiple key values with
 * the same key and value is allowed.
 * 
 * Note that this collection is immutable.
 * 
 * Example usage
 * ```
 * const map = new ArrayMultimap<string, number>()
 *  .set('foo', 3)
 *  .set('foo', 4)
 *  .set('bar', 2);
 * 
 * map.get('foo'); // [3, 4]
 * map.has('foo'); // true
 * ```
 * 
 * @param K The key type
 * @param V The value type
 */
class ImmutableArrayMultimap<K, V> extends ArrayMultimap<K, V> {

  /**
   * Constructs a new, empty multimap.
   */
  constructor() {
    super();
  }

  public set(key: K, value: V): this {
    throw new Error('Collection is immutable.');
  }

  public clear(): void {
    throw new Error('Collection is immutable.');
  }

  public delete(key: K, value: V): boolean {
    throw new Error('Collection is immutable.');
  }

}

export default ImmutableArrayMultimap;
