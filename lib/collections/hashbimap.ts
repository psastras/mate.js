import * as _ from 'lodash';
import BiMap from './bimap';
import ImmutableEntry from './immutableentry';
import Hashing from './hashing';
import Objects from '../primitives/objects';

const LOAD_FACTOR = 1.0;

export class BiEntry<K, V> extends ImmutableEntry<K, V> {
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

/**
 * A {@link BiMap} backed by two hash tables. This implementation guarantees insertion-based
 * iteration order of its keys.
 */
export default class HashBiMap<K, V> implements BiMap<K, V> {

  private _size: number;
  private hashTableKToV: Array<BiEntry<K, V>>;
  private hashTableVToK: Array<BiEntry<K, V>>;
  private firstInKeyInsertionOrder: BiEntry<K, V>;
  private lastInKeyInsertionOrder: BiEntry<K, V>;
  private mask: number;
  private modCount: number;

  /**
   * Constructs a new, empty bimap with the specified expected size.
   *
   * @param expectedSize the expected number of entries
   */
  constructor(expectedSize: number = 16) {
    const tableSize = Hashing.closedTableSize(expectedSize, LOAD_FACTOR);
    this.hashTableKToV = this.createTable(tableSize);
    this.hashTableVToK = this.createTable(tableSize);
    this.firstInKeyInsertionOrder = null;
    this.lastInKeyInsertionOrder = null;
    this._size = 0;
    this.mask = tableSize - 1;
    this.modCount = 0;
  }

  get(key: K): V {
    const entry = this.seekByKey(key, Hashing.smearedHash(key));
    return entry ? entry.value : null;
  }

  set(key: K, value: V, force: boolean = false): this {
    this._putInverse(value, key, force);
    return this;
  }

  delete(key: K): boolean {
    const entry = this.seekByKey(key, Hashing.smearedHash(key));
    if (!entry) {
      return false;
    } else {
      this._remove(entry);
      entry.prevInKeyInsertionOrder = null;
      entry.nextInKeyInsertionOrder = null;
      return true;
    }
  }

  has(key: K): boolean {
    return !!this.seekByKey(key, Hashing.smearedHash(key));
  }

  hasValue(value: V): boolean {
    return !!this._seekByValue(value, Hashing.smearedHash(value));
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

  get size(): number {
    return this._size;
  }

  forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void {

  }

  [Symbol.iterator](): IterableIterator<[K, V]> {
    return new Array<[K, V]>().values();
  }

  readonly [Symbol.toStringTag]: "Map"

  inverse(): BiMap<V, K> {
    return new Inverse<V, K>(this);
  }

  clear(): void {
    this._size = 0;
    _.fill(this.hashTableKToV, null);
    _.fill(this.hashTableVToK, null);
    this.firstInKeyInsertionOrder = null;
    this.lastInKeyInsertionOrder = null;
    this.modCount++;
  }

  /**
   * Finds and removes entry from the bucket linked lists in both the
   * key-to-value direction and the value-to-key direction.
   * @param entry The entry to delete from the lists.
   */
  _remove(entry: BiEntry<K, V>): void {
    const keyBucket = entry.keyHash & this.mask;
    let prevBucketEntry = null;
    for (let bucketEntry = this.hashTableKToV[keyBucket];
         true;
         bucketEntry = bucketEntry.nextInKToVBucket) {
      if (bucketEntry === entry) {
        if (!prevBucketEntry) {
          this.hashTableKToV[keyBucket] = entry.nextInKToVBucket;
        } else {
          prevBucketEntry.nextInKToVBucket = entry.nextInKToVBucket;
        }
        break;
      }
      prevBucketEntry = bucketEntry;
    }

    const valueBucket = entry.valueHash & this.mask;
    prevBucketEntry = null;
    for (let bucketEntry = this.hashTableVToK[keyBucket];
         true;
         bucketEntry = bucketEntry.nextInVToKBucket) {
      if (bucketEntry === entry) {
        if (!prevBucketEntry) {
          this.hashTableVToK[valueBucket] = entry.nextInVToKBucket;
        } else {
          prevBucketEntry.nextInVToKBucket = entry.nextInVToKBucket;
        }
        break;
      }
      prevBucketEntry = bucketEntry;
    }

    if (!entry.prevInKeyInsertionOrder) {
      this.firstInKeyInsertionOrder = entry.nextInKeyInsertionOrder;
    } else {
      entry.prevInKeyInsertionOrder.nextInKeyInsertionOrder = entry.nextInKeyInsertionOrder;
    }

    if (!entry.nextInKeyInsertionOrder) {
      this.lastInKeyInsertionOrder = entry.prevInKeyInsertionOrder;
    } else {
      entry.nextInKeyInsertionOrder.prevInKeyInsertionOrder = entry.prevInKeyInsertionOrder;
    }

    this._size--;
    this.modCount++;
  }

  private insert(entry: BiEntry<K, V>, oldEntryForKey: BiEntry<K, V>): void {
    const keyBucket = entry.keyHash & this.mask;
    entry.nextInKToVBucket = this.hashTableKToV[keyBucket];
    this.hashTableKToV[keyBucket] = entry;

    const valueBucket = entry.valueHash & this.mask;
    entry.nextInVToKBucket = this.hashTableVToK[valueBucket];
    this.hashTableVToK[valueBucket] = entry;

    if (!oldEntryForKey) {
      entry.prevInKeyInsertionOrder = this.lastInKeyInsertionOrder;
      entry.nextInKeyInsertionOrder = null;
      if (!this.lastInKeyInsertionOrder) {
        this.firstInKeyInsertionOrder = entry;
      } else {
        this.lastInKeyInsertionOrder.nextInKeyInsertionOrder = entry;
      }
      this.lastInKeyInsertionOrder = entry;
    } else {
      entry.prevInKeyInsertionOrder = oldEntryForKey.prevInKeyInsertionOrder;
      if (!entry.prevInKeyInsertionOrder) {
        this.firstInKeyInsertionOrder = entry;
      } else {
        entry.prevInKeyInsertionOrder.nextInKeyInsertionOrder = entry;
      }
      entry.nextInKeyInsertionOrder = oldEntryForKey.nextInKeyInsertionOrder;
      if (!entry.nextInKeyInsertionOrder) {
        this.lastInKeyInsertionOrder = entry;
      } else {
        entry.nextInKeyInsertionOrder.prevInKeyInsertionOrder = entry;
      }
    }

    this._size++;
    this.modCount++;
  }

  private seekByKey(key: K, keyHash: number): BiEntry<K, V> {
    for (let entry = this.hashTableKToV[keyHash & this.mask];
             !!entry;
             entry = entry.nextInKToVBucket) {
      if (keyHash === entry.keyHash && Objects.isEqual(key, entry.key)) {
        return entry;
      }
    }
    return null;
  }

  _seekByValue(value: V, valueHash: number): BiEntry<K, V> {
    for (let entry = this.hashTableVToK[valueHash & this.mask]; 
             !!entry;
             entry = entry.nextInVToKBucket) {
      if (valueHash === entry.valueHash && Objects.isEqual(value, entry.value)) {
        return entry;
      }
    }
    return null;
  }

  _putInverse(value: V, key: K, force: boolean): K {
    const valueHash = Hashing.smearedHash(value);
    const keyHash = Hashing.smearedHash(key);
    const oldEntryForValue = this._seekByValue(value, valueHash);
    if (oldEntryForValue && keyHash === oldEntryForValue.keyHash 
        && Objects.isEqual(key, oldEntryForValue.key)) {
      return key;
    }

    const oldEntryForKey = this.seekByKey(key, keyHash);
    if (oldEntryForKey) {
      if (force) {
        this._remove(oldEntryForKey);
      } else {
        throw new Error(`key already present: ${key}`);
      }
    }

    if (oldEntryForValue) {
      if (force) {
        this._remove(oldEntryForValue);
      } else {
        throw new Error(`value already present: ${value}`);
      }
    }
    const newEntry = new BiEntry<K, V>(key, keyHash, value, valueHash);
    this.insert(newEntry, oldEntryForKey);
    if (oldEntryForKey) {
      oldEntryForKey.prevInKeyInsertionOrder = null;
      oldEntryForKey.nextInKeyInsertionOrder = null;
    }
    this.rehashIfNecessary();
    return oldEntryForValue ? oldEntryForValue.key : null;
  }

  private rehashIfNecessary(): void {
    const oldKToV = this.hashTableKToV;
    if (Hashing.needsResizing(this.size, oldKToV.length, LOAD_FACTOR)) {
      const newTableSize = oldKToV.length * 2;

      this.hashTableKToV = this.createTable(newTableSize);
      this.hashTableVToK = this.createTable(newTableSize);
      this.mask = newTableSize - 1;
      this._size = 0;

      for (let entry = this.firstInKeyInsertionOrder;
           !!entry;
           entry = entry.nextInKeyInsertionOrder) {
             this.insert(entry, entry);
      }
      this.modCount++;
    }
  }

  private createTable(length: number): Array<BiEntry<K, V>> {
    return new Array<BiEntry<K, V>>(length);
  }
}

class Inverse<V, K> implements BiMap<V, K> {

  private readonly delegate: HashBiMap<K, V>;

  constructor(delegate: HashBiMap<K, V>) {
    this.delegate = delegate;
  }
  
  inverse(): BiMap<K, V> {
    return this.delegate;
  }

  get size(): number {
    return this.delegate.size;
  }

  set(value: V, key: K): this {
    this.delegate._putInverse(value, key, false);
    return this;
  }

  has(value: V): boolean {
    return this.delegate.hasValue(value);
  }
  
  get(value: V): K {
    const entry = this.delegate._seekByValue(value, Hashing.smearedHash(value));
    return entry ? entry.key : null; 
  }

  delete(value: V): boolean {
    const entry = this.delegate._seekByValue(value, Hashing.smearedHash(value));
    if (!entry) {
      return false;
    } else {
      this.delegate._remove(entry);
      entry.prevInKeyInsertionOrder = null;
      entry.nextInKeyInsertionOrder = null;
      return true;
    }
  }

  forEach(callbackfn: (value: K, index: V, map: Map<V, K>) => void, thisArg?: any): void {

  }

  clear(): void {
    this.delegate.clear();
  }

  entries(): IterableIterator<[V, K]> {
    return new Array<[V, K]>().values();
  }

  keys(): IterableIterator<V> {
    return new Array<V>().values();
  }

  values(): IterableIterator<K> {
    return new Array<K>().values();
  }

  [Symbol.iterator](): IterableIterator<[V, K]> {
    return new Array<[V, K]>().values();
  }

  readonly [Symbol.toStringTag]: "Map"

}