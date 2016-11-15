/**
 * A {@link Map} which is immutable after construction.  An {@link Error} will be
 * thrown if an attempt is made to modify this map.
 * 
 * Example usage
 * ```
 * const map = new ImmutableMap<string, number>(
 *   ['foo', 3], ['bar', 2]
 * );
 * 
 * map.get('foo'); // 3
 * map.has('bar'); // true
 * 
 * // the map cannot be modified
 * map.set('voo', 3); // throw new Error
 * map.clear(); // throw new Error
 * 
 * ```
 * 
 * @param K The key type
 * @param V The value type
 */
class ImmutableMap<K, V> implements Map<K, V> {

  public readonly [Symbol.toStringTag]: 'Map';
  private readonly errorMessage: 'Error modifying an immutable map.';
  private delegate: Map<K, V>;

  constructor(...items: [K, V][]) {
    this.delegate = new Map<K, V>();
    for (let item of items) {
      this.delegate.set(item[0], item[1]);
    }
  }

  /**
   * The size (number of entries) in the map.
   */
  public get size(): number {
    return this.delegate.size;
  }

  /**
   * Throws an Error (this collection is immutable)
   * @param key The key of the entry
   * @param value The value of the entry
   */
  public clear(): void {
    throw new Error(this.errorMessage);
  }

  /**
   * Throws an Error (this collection is immutable)
   * @param key The key of the entry
   * @param value The value of the entry
   */
  public delete(key: K): boolean {
    throw new Error(this.errorMessage);
  }

  /**
   * Executes the given function once for each entry in the map.
   * @param callbackfn The function to execute
   * @param thisArg Value to use as `this` when executing the call
   */
  public forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void {
    this.delegate.forEach(callbackfn);
  }

  /**
   * Returns the associated value of the key in the map, if it exists.
   * @param key The key of the entry
   * @returns THe value if the key exists, undefined otherwise
   */
  public get(key: K): V | undefined {
    return this.delegate.get(key);
  }

  /**
   * Checks if the key exists in the map.
   * @param The key to look up
   * @returns True if it exists, false otherwise
   */
  public has(key: K): boolean {
    return this.delegate.has(key);
  }

  /**
   * Throws an Error (this collection is immutable)
   * @param key The key of the entry
   * @param value The value of the entry
   */
  public set(key: K, value?: V): this {
    throw new Error(this.errorMessage);
  }

  /**
   * Returns an iterator over the entries of the map.
   * @returns An iterator over the entries
   */
  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.delegate[Symbol.iterator]();
  }

  /**
   * Returns an iterator over the entries of the map.
   * @returns An iterator over the entries
   */
  public entries(): IterableIterator<[K, V]> {
    return this.delegate.entries();
  }

  /**
   * Returns an iterator over the keys of the map.
   * @returns An iterator over the keys
   */
  public keys(): IterableIterator<K> {
    return this.delegate.keys();
  }

  /**
   * Returns an iterator over the values of the map.
   * @returns An iterator over the values
   */
  public values(): IterableIterator<V> {
    return this.delegate.values();
  }
}

export default ImmutableMap;
