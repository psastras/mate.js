import BiMap from './bimap';
import ImmutableEntry from './immutableentry';
import Hashing from './hashing';
import Objects from '../primitives/objects';

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

/**
 * A {@link BiMap} backed by two hash tables. This implementation guarantees insertion-based
 * iteration order of its keys.
 */
export default class HashBiMap<K, V> implements BiMap<K, V> {

  size: number;
  private hashTableKToV: Array<BiEntry<K, V>>
  private hashTableVToK: Array<BiEntry<K, V>>
  private firstInKeyInsertionOrder: BiEntry<K, V>
  private lastInKeyInsertionOrder: BiEntry<K, V>
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
    this.size = 0;
    this.mask = tableSize - 1;
    this.modCount = 0;
  }

  get(key: K): V {
    const entry = this.seekByKey(key, Hashing.smearedHash(key));
    return entry ? entry.value : null;
  }
  
  set(key: K, value: V, force: boolean = false): this {
    this.putInverse(value, key, force)
    return this;
  }

  delete(key: K): boolean {
    const entry = this.seekByKey(key, Hashing.smearedHash(key));
    if (!entry) {
      return false;
    } else {
      this.remove(entry);
      entry.prevInKeyInsertionOrder = null;
      entry.nextInKeyInsertionOrder = null;
      return true;
    }
  }

  has(key: K): boolean {
    return !!this.seekByKey(key, Hashing.smearedHash(key));
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

  inverse(): BiMap<V, K> {
    return new HashBiMap<V, K>(0);
  }

  clear(): void {
    
  }

  /**
   * Finds and removes entry from the bucket linked lists in both the
   * key-to-value direction and the value-to-key direction.
   * @param entry The entry to delete from the lists.
   */
  private remove(entry: BiEntry<K, V>): void {
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

    this.size--;
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

    this.size++;
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

  private seekByValue(value: V, valueHash: number): BiEntry<K, V> {
    for (let entry = this.hashTableVToK[valueHash & this.mask]; 
             !!entry; 
             entry = entry.nextInVToKBucket) {
      if (valueHash === entry.valueHash && Objects.isEqual(value, entry.value)) {
        return entry;
      }
    }
    return null;
  }

  private putInverse(value: V, key: K, force: boolean): K {
    const valueHash = Hashing.smearedHash(value);
    const keyHash = Hashing.smearedHash(key);

    const oldEntryForValue = this.seekByValue(value, valueHash);
    if (oldEntryForValue && keyHash === oldEntryForValue.keyHash 
        && Objects.isEqual(key, oldEntryForValue.key)) {
      return key;
    }

    const oldEntryForKey = this.seekByKey(key, keyHash);
    if (oldEntryForKey) {
      if (force) {
        this.remove(oldEntryForKey);
      } else {
        throw `value already present: ${key}`;
      }
    }

    if (oldEntryForValue) {
      this.remove(oldEntryForValue);
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
      this.size = 0;

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