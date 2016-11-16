import AbstractMultimap from './abstractmultimap';
import ArrayMultimap from './arraymultimap';
import Collection from './collection';

/**
 * A collection that maps keys to values, similar to {@link Map}, but in which
 * each key may be associated with _multiple_ values.
 * 
 * This collection is immutable, modifying the collectino will throw an {@link Error}.
 * 
 * @param K The key type
 * @param V The value type
 */
class ImmutableMultimap<K, V> extends AbstractMultimap<K, V> {

  private multimap: ArrayMultimap<K, V>;
  private readonly errorMessage: 'Cannot modify an immutable map.';

  constructor(...items: [K, V][]) {
    super();
    this.multimap = new ArrayMultimap<K, V>();
    for (let item of items) {
      this.multimap.set(item[0], item[1]);
    }
  }

   /** @inheritdoc */
  public asMap(): Map<K, Array<V> | Collection<V>> {
    return this.multimap.asMap();
  }

  /** @inheritdoc */
  public _createCollection(): Array<V> | Collection<V> {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public set(key: K, value: V): this {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public delete(key: K, value: V): boolean {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public get(key: K): Array<V> | Collection<V> {
    return this.multimap.get(key);
  }

  /** @inheritdoc */
  public clear(): void {
    throw new Error(this.errorMessage);
  }

}

export default ImmutableMultimap;
