/**
 * Represents an immutable key value pair.
 */
export default class ImmutableEntry<K, V> {
  readonly key: K;
  readonly value: V;

  /**
   * Constructs a new readonly key value pair.
   * @param key The key.
   * @pram value The value.
   */
  constructor(key: K, value: V) {
    this.key = key;
    this.value = value;
  } 
}