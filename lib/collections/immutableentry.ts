/**
 * Represents an immutable key value pair.
 * 
 * @param K The key type
 * @param V The value type
 */
export default class ImmutableEntry<K, V> {
  readonly key: K;
  readonly value: V;

  /**
   * Constructs a new readonly key value pair.
   * @param key The key.
   * @param value The value.
   */
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  } 
}