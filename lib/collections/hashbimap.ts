import * as _ from 'lodash';
import BiMap from './bimap';
import ImmutableEntry from './immutableentry';
import Hashing from './hashing';
import Objects from '../primitives/objects';

/**
 * The expected load of the map.  {@link HashBiMap} do not support changing load factors, so 
 * this is a constant.
 */
const LOAD_FACTOR = 1.0;

/**
 * An internal class used to hold a map entry and the next and previous entries as well as the
 * hash values.
 * 
 * @param K The key type
 * @param V The value type
 */
export class BiEntry<K, V> extends ImmutableEntry<K, V> {
  public readonly keyHash: number;
  public readonly valueHash: number;

  /**
   * Link to the next entry in the KtoV list
   */
  public nextInKToVBucket: BiEntry<K, V>;
  /**
   * Link to the next entry in the VtoK list
   */
  public nextInVToKBucket: BiEntry<K, V>;

  /**
   * Link to the next entry which was inserted
   */
  public nextInKeyInsertionOrder: BiEntry<K, V>;
  /**
   * Link to the previous entry which was inserted
   */
  public prevInKeyInsertionOrder: BiEntry<K, V>;

  constructor(key: K, keyHash: number, value: V, valueHash: number) {
    super(key, value);
    this.keyHash = keyHash;
    this.valueHash = valueHash;
  }
}

/**
 * A {@link BiMap} backed by two hash tables. This implementation guarantees insertion-based
 * iteration order of its keys.
 * 
 * Example usage
 * ```
 * const map = new HashBiMap<string, number>()
 *  .set('foo', 3)
 *  .set('bar', 2);
 * 
 * map.get('foo'); // 3
 * map.hasValue(2); // true
 * 
 * // get a reference to the inverted map (number to string)
 * const inverse = map.inverse();
 * inverse.get(3); // "foo"
 * inverse.delete(2); // true
 * 
 * map.get('bar'); // undefined
 * inverse.get(2); // undefined
 * 
 * ```
 * 
 * @param K The key type
 * @param V The value type
 */
export default class HashBiMap<K, V> implements BiMap<K, V> {

  public readonly [Symbol.toStringTag]: 'Map';
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

  /**
   * Gets the value associated with a given key.
   * @param The key to retrieve
   * @returns The value associated with the key if it exists, undefined otherwise
   */
  public get(key: K): V {
    const entry = this.seekByKey(key, Hashing.smearedHash(key));
    return entry ? entry.value : undefined;
  }

  /**
   * Inserts an entry into the map.
   * @param key The key of the entry
   * @param value The value of the entry
   * @param force If true, will overwrite existing entries with the same key or value.  If false,
   * will throw an error.
   */
  public set(key: K, value: V, force: boolean = false): this {
    this._putInverse(value, key, force);
    return this;
  }

  /**
   * Deletes the entry associated with a given key from the map.
   * @param The key to delete
   * @returns True if an entry was deleted, false otherwise
   */
  public delete(key: K): boolean {
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

  /**
   * Checks if the key exists in the map.
   * @param The key to look up
   * @returns True if it exists, false otherwise
   */
  public has(key: K): boolean {
    return !!this.seekByKey(key, Hashing.smearedHash(key));
  }

  /**
   * Checks if the value exists in the map.
   * @param The value to look up
   * @returns True if it exists, false otherwise
   */
  public hasValue(value: V): boolean {
    return !!this._seekByValue(value, Hashing.smearedHash(value));
  }

  /**
   * Returns an iterator over the entries of the map.
   * @returns An iterator over the entries
   */
  public entries(): IterableIterator<[K, V]> {
    let pointer = this.firstInKeyInsertionOrder;
    return {
      next(): IteratorResult<[K, V]> {
        if (!pointer) {
           return { done: true, value: undefined };
        }
        const value: [K, V] = [ pointer.key, pointer.value ];
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<[K, V]> {
        return this;
      },
    };
  }

  /**
   * Returns an iterator over the keys of the map.
   * @returns An iterator over the keys
   */
  public keys(): IterableIterator<K> {
    let pointer = this.firstInKeyInsertionOrder;
    return {
      next(): IteratorResult<K> {
        if (!pointer) {
          return { done: true, value: undefined };
        }
        const value = pointer.key;
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<K> {
        return this;
      },
    };
  }

  /**
   * Returns an iterator over the values of the map.
   * @returns An iterator over the values
   */
  public values(): IterableIterator<V> {
    let pointer = this.firstInKeyInsertionOrder;
    return {
      next(): IteratorResult<V> {
        if (!pointer) {
          return { done: true, value: undefined };
        }
        const value = pointer.value;
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<V> {
        return this;
      },
    };
  }

  /**
   * The size (number of entries) in the map.
   */
  get size(): number {
    return this._size;
  }

  /**
   * Returns the first entry added to the map.
   * @returns The entry
   */
  get _first(): BiEntry<K, V> {
    return this.firstInKeyInsertionOrder;
  }

  /**
   * Executes the given function once for each entry in the map.
   * @param callbackfn The function to execute
   * @param thisArg Value to use as `this` when executing the call
   */
  public forEach(callbackfn: (value: V, index: K, map: Map<K, V>) => void, thisArg?: any): void {
    const _this = thisArg || this;
    for (let entry of (thisArg || _this)) {
      callbackfn(entry[1], entry[0], _this);
    }
  }

  /**
   * Returns an iterator over the entries.
   * @returns An iterator
   */
  public [Symbol.iterator](): IterableIterator<[K, V]> {
    return this.entries();
  }

  /**
   * Returns the inverted map.  Note that this is a reference - changes made to the inverse
   * will affect the original map, and vice versa.
   * @returns The inverted view of this map.
   */
  public inverse(): BiMap<V, K> {
    return new Inverse<V, K>(this);
  }

  /**
   * Clears all entries in the map.
   */
  public clear(): void {
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
  public _remove(entry: BiEntry<K, V>): void {
    // check if the entry exists in the KtoV list
    const keyBucket = entry.keyHash & this.mask;
    let prevBucketEntry = null;
    for (let bucketEntry = this.hashTableKToV[keyBucket];
         true;
         bucketEntry = bucketEntry.nextInKToVBucket) { // start at the hash location and scan
      if (bucketEntry === entry) {
        // remove the entry from the list 
        if (!prevBucketEntry) {
          this.hashTableKToV[keyBucket] = entry.nextInKToVBucket;
        } else {
          prevBucketEntry.nextInKToVBucket = entry.nextInKToVBucket;
        }
        break;
      }
      prevBucketEntry = bucketEntry;
    }

    // check if the entry exists in the VtoK list
    const valueBucket = entry.valueHash & this.mask;
    prevBucketEntry = null;
    for (let bucketEntry = this.hashTableVToK[keyBucket];
         true;
         bucketEntry = bucketEntry.nextInVToKBucket) { // start at the hash location and scan
      if (bucketEntry === entry) {
        // remove the entry from the list
        if (!prevBucketEntry) {
          this.hashTableVToK[valueBucket] = entry.nextInVToKBucket;
        } else {
          prevBucketEntry.nextInVToKBucket = entry.nextInVToKBucket;
        }
        break;
      }
      prevBucketEntry = bucketEntry;
    }

    // if the last entry inserted was removed, update the head pointer
    if (!entry.prevInKeyInsertionOrder) {
      this.firstInKeyInsertionOrder = entry.nextInKeyInsertionOrder;
    } else {
      entry.prevInKeyInsertionOrder.nextInKeyInsertionOrder = entry.nextInKeyInsertionOrder;
    }

    // if the last entry inserted was removed, update the tail pointer
    if (!entry.nextInKeyInsertionOrder) {
      this.lastInKeyInsertionOrder = entry.prevInKeyInsertionOrder;
    } else {
      entry.nextInKeyInsertionOrder.prevInKeyInsertionOrder = entry.prevInKeyInsertionOrder;
    }

    this._size--;
    this.modCount++;
  }

  /**
   * Seeks for an entry with the given value, starting at the value's hash value in the list.
   * @param V The value to look for
   * @param valueHash The value's hash value
   * @returns The corresponding entry if it exists, null otherwise
   */
  public _seekByValue(value: V, valueHash: number): BiEntry<K, V> {
    for (let entry = this.hashTableVToK[valueHash & this.mask];
             !!entry;
             entry = entry.nextInVToKBucket) {
      if (valueHash === entry.valueHash && Objects.isEqual(value, entry.value)) {
        return entry;
      }
    }
    return null;
  }

  /**
   * Puts the key and value into the map and returns the old entry's key if an entry was replaced.
   * @param V The value to insert
   * @param K The key to insert
   * @param force If true, will replace a pre-existing key.  If false, will throw an {@link Error} 
   * on conflict
   * @returns The old key if there was one, null otherwise
   */
  public _putInverse(value: V, key: K, force: boolean): K {
    const valueHash = Hashing.smearedHash(value);
    const keyHash = Hashing.smearedHash(key);
    const oldEntryForValue = this._seekByValue(value, valueHash);

    // check if the value exists and is equal
    if (oldEntryForValue && keyHash === oldEntryForValue.keyHash
        && Objects.isEqual(key, oldEntryForValue.key)) {
      return key;
    }

    // if the key already exists, remove it if force is true
    const oldEntryForKey = this.seekByKey(key, keyHash);
    if (oldEntryForKey) {
      if (force) {
        this._remove(oldEntryForKey);
      } else {
        throw new Error(`key already present: ${key}`);
      }
    }

    // if the value already exists, remove it if force is true
    if (oldEntryForValue) {
      if (force) {
        this._remove(oldEntryForValue);
      } else {
        throw new Error(`value already present: ${value}`);
      }
    }

    // add the new entry into the map
    const newEntry = new BiEntry<K, V>(key, keyHash, value, valueHash);
    this.insert(newEntry, oldEntryForKey);
    // clean the old entry's pointers up
    if (oldEntryForKey) {
      oldEntryForKey.prevInKeyInsertionOrder = null;
      oldEntryForKey.nextInKeyInsertionOrder = null;
    }
    this.rehashIfNecessary();
    return oldEntryForValue ? oldEntryForValue.key : null;
  }

  /**
   * Inserts an entry into the map.  If an old entry for the key is provided, the new entries'
   * pointers are updated to match the old entries' pointers.
   * @param entry The entry to insert
   * @param oldEntryForKey The old entry being replaced
   */
  private insert(entry: BiEntry<K, V>, oldEntryForKey: BiEntry<K, V>): void {
    // insert entry into the KtoV list
    const keyBucket = entry.keyHash & this.mask;
    entry.nextInKToVBucket = this.hashTableKToV[keyBucket];
    this.hashTableKToV[keyBucket] = entry;

    // insert entry into the VtoK list
    const valueBucket = entry.valueHash & this.mask;
    entry.nextInVToKBucket = this.hashTableVToK[valueBucket];
    this.hashTableVToK[valueBucket] = entry;

    // if there is no pre-existing key / entry
    if (!oldEntryForKey) {
      // add entry to the tail
      entry.prevInKeyInsertionOrder = this.lastInKeyInsertionOrder;
      entry.nextInKeyInsertionOrder = null;
      if (!this.lastInKeyInsertionOrder) {
        // if the map was empty, add entry to the head as well
        this.firstInKeyInsertionOrder = entry;
      } else {
        // else update the previous tail's next pointer
        this.lastInKeyInsertionOrder.nextInKeyInsertionOrder = entry;
      }
      this.lastInKeyInsertionOrder = entry;
    } else {
      // insert the new entry where the old entry was
      entry.prevInKeyInsertionOrder = oldEntryForKey.prevInKeyInsertionOrder;
      if (!entry.prevInKeyInsertionOrder) {
        // if the old entry was the head, update the head pointer
        this.firstInKeyInsertionOrder = entry;
      } else {
        // else update the entries' pointer
        entry.prevInKeyInsertionOrder.nextInKeyInsertionOrder = entry;
      }
      entry.nextInKeyInsertionOrder = oldEntryForKey.nextInKeyInsertionOrder;
      if (!entry.nextInKeyInsertionOrder) {
        // if the old entry was the tail, udpate the tail pointer
        this.lastInKeyInsertionOrder = entry;
      } else {
        // else update the entries' pointer
        entry.nextInKeyInsertionOrder.prevInKeyInsertionOrder = entry;
      }
    }

    this._size++;
    this.modCount++;
  }

  /**
   * Seeks for an entry with the given key, starting at the key's hash value in the list.
   * @param K The key to look for
   * @param keyHash The key's hash value
   * @returns The corresponding entry if it exists, null otherwise
   */
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

  /**
   * Resizes the internal list structures if necessary (if the number of elements is close to
   * the number of buckets {@link Hashing.needsResizing}).
   */
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

  /**
   * Allocates an array of {@link BiEntry}.
   * @returns The created array
   */
  private createTable(length: number): Array<BiEntry<K, V>> {
    return new Array<BiEntry<K, V>>(length);
  }
}

/**
 * Represents an inverse view of a {@link BiMap}.  Operations on the inverse view will
 * affect the underlying map.
 */
class Inverse<V, K> implements BiMap<V, K> {

  public readonly [Symbol.toStringTag]: 'Map';
  private readonly delegate: HashBiMap<K, V>;

  /**
   * Constructs an inverse view of a given map.
   */
  constructor(delegate: HashBiMap<K, V>) {
    this.delegate = delegate;
  }

  /**
   * Returns the inverted map.  Note that this is a reference - changes made to the inverse
   * will affect the original map, and vice versa.
   * @returns The inverted view of this map.
   */
  public inverse(): BiMap<K, V> {
    return this.delegate;
  }

  /**
   * The size (number of entries) in the map.
   */
  get size(): number {
    return this.delegate.size;
  }

  /**
   * Inserts an entry into the map.
   * @param value The value of the entry
   * @param key The key of the entry
   * @param force If true, will overwrite existing entries with the same key or value.  If false,
   * will throw an error.
   */
  public set(value: V, key: K): this {
    this.delegate._putInverse(value, key, false);
    return this;
  }

  /**
   * Checks if the value exists in the map.
   * @param The value to look up
   * @returns True if it exists, false otherwise
   */
  public has(value: V): boolean {
    return this.delegate.hasValue(value);
  }

  /**
   * Checks if the key exists in the map.
   * @param The key to look up
   * @returns True if it exists, false otherwise
   */
  public hasKey(key: K): boolean {
    return this.delegate.has(key);
  }

  /**
   * Retrieves the key associated with a value.
   * @param The value to look up
   * @returns The key, if it exists (undefined otherwise)
   */
  public get(value: V): K {
    const entry = this.delegate._seekByValue(value, Hashing.smearedHash(value));
    return entry ? entry.key : undefined;
  }

  /**
   * Deletes the entry associated with a given value from the map.
   * @param The value to delete
   * @returns True if an entry was deleted, false otherwise
   */
  public delete(value: V): boolean {
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

  /**
   * Executes the given function once for each entry in the map.
   * @param callbackfn The function to execute
   * @param thisArg Value to use as `this` when executing the call
   */
  public forEach(callbackfn: (value: K, index: V, map: Map<V, K>) => void, thisArg?: any): void {
    const _this = thisArg || this;
    for (let entry of (thisArg || _this)) {
      callbackfn(entry[1], entry[0], _this);
    }
  }

  /**
   * Clears all entries in the map.
   */
  public clear(): void {
    this.delegate.clear();
  }

  /**
   * Returns an iterator over the entries of the map.
   * @returns An iterator over the entries
   */
  public entries(): IterableIterator<[V, K]> {
    let pointer = this.delegate._first;
    return {
      next(): IteratorResult<[V, K]> {
        if (!pointer) {
          return { done: true, value: undefined };
        }
        const value: [V, K] = [ pointer.value, pointer.key ];
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<[V, K]> {
        return this;
      },
    };
  }

  /**
   * Returns an iterator over the keys of the map.
   * @returns An iterator over the keys
   */
  public keys(): IterableIterator<V> {
    let pointer = this.delegate._first;
    return {
      next(): IteratorResult<V> {
        if (!pointer) {
          return { done: true, value: undefined };
        }
        const value = pointer.value;
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<V> {
        return this;
      },
    };
  }

  /**
   * Returns an iterator over the values of the map.
   * @returns An iterator over the values
   */
  public values(): IterableIterator<K> {
    let pointer = this.delegate._first;
    return {
      next(): IteratorResult<K> {
        if (!pointer) {
          return { done: true, value: undefined };
        }
        const value = pointer.key;
        pointer = pointer.nextInKeyInsertionOrder;
        return {
          done: false,
          value: value,
        };
      },

      [Symbol.iterator](): IterableIterator<K> {
        return this;
      },
    };
  }

  /**
   * Returns an iterator over the entries.
   * @returns An iterator
   */
  public [Symbol.iterator](): IterableIterator<[V, K]> {
    return this.entries();
  }

}
