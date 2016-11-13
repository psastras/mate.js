import Collection from './collection';
import ArrayCollection from'./arraycollection';
import Multimap from './multimap';
import AbstractMultimap from './abstractmultimap';

/** @inheritdoc */
class ArrayMultimap<K, V> extends AbstractMultimap<K, V> implements Multimap<K, V> {

  private map: Map<K, ArrayCollection<V>>;

  /**
   * Constructs a new, empty multimap.
   */
  constructor() {
    super();
    this.map = new Map<K, ArrayCollection<V>>();
  }

  /** @inheritdoc */
  _createCollection(): Collection<V> {
    return new ArrayCollection<V>();
  }

  /** @inheritdoc */
  asMap(): Map<K, Collection<V>> {
    return this.map;
  }

  /** @inheritdoc */
  get(key: K): Collection<V> {
    return this.map.get(key);
  }

  readonly [Symbol.toStringTag]: "MultiMap"
}

export default ArrayMultimap;