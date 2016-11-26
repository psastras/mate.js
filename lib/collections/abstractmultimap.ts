import Collection from './collection';
import Multimap from './multimap';

/**
 * A {@link Multimap} which implements several methods using {@link Multimap.asMap}.
 * Subclasses only need to impelment {@link AbstractMultimap.asMap} and 
 * {@link AbstractMultimap._createCollection}.
 * 
 * @param K The key type
 * @param V The value type
 */
abstract class AbstractMultimap<K, V> implements Multimap<K, V> {

  public readonly [Symbol.toStringTag]: 'MultiMap';

  /** @inheritdoc */
  public abstract asMap(): Map<K, V[] | Collection<V>>;

  /** @inheritdoc */
  public set(key: K, value: V): this {
    const oldValue = this.asMap().get(key);
    if (oldValue) {
      if (Array.isArray(oldValue)) {
        oldValue.push(value);
      } else {
        oldValue.add(value);
      }
    } else {
      const newValue = this._createCollection();
      if (Array.isArray(newValue)) {
        newValue.push(value);
      } else {
        newValue.add(value);
      }
      this.asMap().set(key, newValue);
    }
    return this;
  }

  /** @inheritdoc */
  public delete(key: K, value: V): boolean {
    const values = this.asMap().get(key);
    if (!values) {
      return false;
    }

    let deleted = false;
    if (Array.isArray(values)) {
      const idx = values.indexOf(value);
      deleted = idx !== -1;
      if (deleted) {
        values.splice(idx);
      }
    } else {
      deleted = values.delete(value);
    }
    if (values.length === 0) {
      this.asMap().delete(key);
    }
    return deleted;
  }

  /** @inheritdoc */
  public has(key: K): boolean {
    return !!this.get(key);
  }

  /** @inheritdoc */
  public abstract get(key: K): V[] | Collection<V>;

  /** @inheritdoc */
  public entries(): IterableIterator<[K, V[] | Collection<V>]> {
    return this.asMap().entries();
  }

  /** @inheritdoc */
  public keys(): IterableIterator<K> {
    return this.asMap().keys();
  }

  /** @inheritdoc */
  public values(): IterableIterator<V[] | Collection<V>> {
    return this.asMap().values();
  }

  /** @inheritdoc */
  public forEach(callbackfn: (value: V[] | Collection<V>,
                 index: K,
                 map: Map<K, V[] | Collection<V>>) => void,
                 thisArg?: any): void {
    this.asMap().forEach(callbackfn);
  }

  /** @inheritdoc */
  public clear(): void {
    this.asMap().clear();
  }

  /** @inheritdoc */
  public get size(): number {
    return this.asMap().size;
  }

  /** @inheritdoc */
  public [Symbol.iterator](): IterableIterator<[K, V[] | Collection<V>]> {
    return this.entries();
  }

  /** @inheritdoc */
  protected abstract _createCollection(): V[] | Collection<V>;

}

export default AbstractMultimap;
