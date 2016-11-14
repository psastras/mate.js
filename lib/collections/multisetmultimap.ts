import Multimap from './multimap';
import AbstractMultimap from './abstractmultimap';
import MapMultiset from './mapmultiset';

/**
 * A {@link Multimap} backed by {@link Multiset} storing multiple values per key.  Iteration
 * order is not maintained for each value in a key.  Note that adding multiple key values with
 * the same key and value is allowed.
 * 
 * Example usage
 * ```
 * const map = new MultisetMultimap<string, number>()
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
class MultisetMultimap<K, V> extends AbstractMultimap<K, V> implements Multimap<K, V> {

  public readonly [Symbol.toStringTag]: 'MultiMap';
  private map: Map<K, MapMultiset<V>>;

  /**
   * Constructs a new, empty multimap.
   */
  constructor() {
    super();
    this.map = new Map<K, MapMultiset<V>>();
  }

  /** @inheritdoc */
  public _createCollection(): MapMultiset<V> {
    return new MapMultiset<V>();
  }

  /** @inheritdoc */
  public asMap(): Map<K, MapMultiset<V>> {
    return this.map;
  }

  /** @inheritdoc */
  public get(key: K): MapMultiset<V> {
    return this.map.get(key);
  }

}

export default MultisetMultimap;
