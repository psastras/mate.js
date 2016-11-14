import Collection from './collection';
import ArrayCollection from'./arraycollection';
import Multimap from './multimap';
import AbstractMultimap from './abstractmultimap';

/**
 * A {@link Multimap} backed by arrays storing multiple values per key.  Iteration
 * order is maintained for each value in a key.  Note that adding multiple key values with
 * the same key and value is allowed.
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
class ArrayMultimap<K, V> extends AbstractMultimap<K, V> implements Multimap<K, V> {

  public readonly [Symbol.toStringTag]: 'MultiMap';
  private map: Map<K, ArrayCollection<V>>;

  /**
   * Constructs a new, empty multimap.
   */
  constructor() {
    super();
    this.map = new Map<K, ArrayCollection<V>>();
  }

  /** @inheritdoc */
  public _createCollection(): Collection<V> {
    return new ArrayCollection<V>();
  }

  /** @inheritdoc */
  public asMap(): Map<K, Collection<V>> {
    return this.map;
  }

  /** @inheritdoc */
  public get(key: K): Collection<V> {
    return this.map.get(key);
  }

}

export default ArrayMultimap;
