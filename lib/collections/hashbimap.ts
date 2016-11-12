import BiMap from './bimap';
import ImmutableEntry from './immutableentry';
import Hashing from './hashing';

const LOAD_FACTOR = 1.0;

class BiEntry<K, V> extends ImmutableEntry<K, V> {
  readonly keyHash: number;
  readonly valueHash: number;

  nextInKToVBucket: BiEntry<K, V>;
  nextInVToKBucket: BiEntry<K, V>;

  nextInKeyInsertionOrder: BiEntry<K, V>;
  prevInKeyInsertionOrder: BiEntry<K, V>;

  constructor(key: K, keyHash: number, value: V, valueHash: number) {
    super(key, value);
    this.keyHash = keyHash;
    this.valueHash = valueHash;
  }
}

class HashBiMap<K, V> implements BiMap<K, V> {

  size: number;
  private hashTableKToV: Array<BiEntry<K, V>>
  private hashTableVToK: Array<BiEntry<K, V>>
  private firstInKeyInsertionOrder: BiEntry<K, V>
  private lastInKeyInsertionOrder: BiEntry<K, V>
  private mask: number;
  private modCount: number;

  constructor(expectedSize: number) {
    const tableSize = Hashing.closedTableSize(expectedSize, LOAD_FACTOR);
    this.hashTableKToV = this.createTable(tableSize);
    this.hashTableVToK = this.createTable(tableSize);
    this.firstInKeyInsertionOrder = null;
    this.lastInKeyInsertionOrder = null;
    this.size = 0;
    this.mask = tableSize - 1;
    this.modCount = 0;
  }
  
  set(key: K, value?: V): this {
    return this;
  }

  delete(key: K): boolean {
    return true;
  }

  has(key: K): boolean {
    return true;
  }

  entries(): IterableIterator<[K, V]> {
    return new Array<[K, V]>().values();
  }

  keys(): IterableIterator<K> {
    return new Array<K>().values();
  }

  values(): IterableIterator<V> {
    return new Array<V>().values();
  }

  forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void {

  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return new Array<[K, V]>().values();
  }

  readonly [Symbol.toStringTag]: "Map"

  get(key: K): V {
    return null;
  }

  inverse(): BiMap<V, K> {
    return new HashBiMap<V, K>(0);
  }

  clear(): void {
    
  }

  private createTable(length: number): Array<BiEntry<K, V>> {
    return new Array<BiEntry<K, V>>(length);
  }
}