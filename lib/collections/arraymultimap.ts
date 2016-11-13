import Multimap from './multimap';

class ArrayMultimap<K, V> implements Multimap<K, V> {

  /** @inheritdoc */
  size: number;

  /** @inheritdoc */
  asMap(): Map<K, Iterable<V>> {
    return null;
  }

  /** @inheritdoc */
  set(key: K, value: V): this {
    return this;
  }

  /** @inheritdoc */
  delete(key: K): boolean {
    return null;
  }

  /** @inheritdoc */
  has(key: K): boolean {
    return null;
  }

  /** @inheritdoc */
  get(key: K): Iterable<V> {
    return null;
  }

  /** @inheritdoc */
  entries(): IterableIterator<[K, IterableIterator<V>]> {
    return null;
  }

  /** @inheritdoc */
  keys(): IterableIterator<K> {
    return null;
  }

  /** @inheritdoc */
  values(): IterableIterator<V> {
    return null;
  }

  /** @inheritdoc */
  forEach(callbackfn: (value: V, index: K, map: Multimap<K, V>) => void, thisArg?: any): void {

  }

  /** @inheritdoc */
  clear(): void {

  }

  /** @inheritdoc */
  [Symbol.iterator](): IterableIterator<[K, IterableIterator<V>]> {
    return this.entries();
  }

  readonly [Symbol.toStringTag]: "MultiMap"
}