/**
 * A BiMap maintains a mapping between keys and values as well as values
 * to keys.  Lookup in either direction is O(1).  Both the keys and the
 * values in a BiMap are unique.
 *   
 * @param K The key type
 * @param V The value type
 */
interface BiMap<K, V> extends Map<K, V> {
  inverse(): BiMap<V, K>;
}

export default BiMap;