import Collection from './collection';
import Multimap from './multimap';

/**
 * A {@link Multimap} which implements several methods using {@link Multimap.asMap}.
 * Subclasses only need to implment {@link AbstractMultimap.asMap} and 
 * {@link AbstractMultimap._createCollection}.
 * 
 * @param K The key type
 * @param V The value type
 */
abstract class AbstractMultimap<K, V> implements Multimap<K, V> {

  /**
   * Constructs a new, empty multimap.
   */
  constructor() { }

  /** @inheritdoc */
  abstract asMap(): Map<K, Collection<V>>;

  /** @inheritdoc */
  abstract _createCollection(): Collection<V>;

  /** @inheritdoc */
  set(key: K, value: V): this {
    const oldValue = this.asMap().get(key);
    if (oldValue) oldValue.push(value);
    else {
      const newValue = this._createCollection();
      newValue.push(value);
      this.asMap().set(key, newValue);
    }
    return this;
  }

  /** @inheritdoc */
  delete(key: K, value: V): boolean {
    const values = this.asMap().get(key);
    if (!values) return false;
    const deleted = values.delete(value);
    if (values.length === 0) {
      this.asMap().delete(key);
    }
    return deleted;
  }

  /** @inheritdoc */
  has(key: K): boolean {
    return !!this.get(key);
  }

  /** @inheritdoc */
  abstract get(key: K): Collection<V>;

  /** @inheritdoc */
  entries(): IterableIterator<[K, Collection<V>]> {
    return this.asMap().entries();
  }

  /** @inheritdoc */
  keys(): IterableIterator<K> {
    return this.asMap().keys();
  }

  /** @inheritdoc */
  values(): IterableIterator<Collection<V>> {
    return this.asMap().values();
  }

  /** @inheritdoc */
  forEach(callbackfn: (value: Collection<V>, index: K,
          map: Map<K, Collection<V>>) => void, thisArg?: any): void {
    this.asMap().forEach(callbackfn);
  }

  /** @inheritdoc */
  clear(): void {
    this.asMap().clear();
  }

  /** @inheritdoc */
  get size(): number {
    return this.asMap().size;
  }

  /** @inheritdoc */
  [Symbol.iterator](): IterableIterator<[K, Collection<V>]> {
    return this.entries();
  }

  readonly [Symbol.toStringTag]: "MultiMap"
}

export default AbstractMultimap;