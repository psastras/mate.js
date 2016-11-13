/**
 * Helper functions to hash objects needed for hash based collections.
 */

import * as ObjectHash from 'object-hash';
import Numbers from '../primitives/numbers';

/**
 * Maximum collection size, based on the available number of hash codes (buckets)
 */
const MAX_TABLE_SIZE = Math.pow(2, 52);

/**
 * Number used to smear hashes, pulled from the Murmur hash function.
 */
const C1 = 0xcc9e2d51;
/**
 * Number used to smear hashes, pulled from the Murmur hash function.
 */
const C2 = 0x1b873593;

/**
 * Computes the nearest power of two that is less than the given number.
 * ```
 * expect(_nearestLowerPowerOfTwo(10)).to.equal(8);
 * ```
 * @param x The number to compute
 * @returns The nearest power of two that is less than the input number.
 */
export function _nearestLowerPowerOfTwo(x: number): number {
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x - (x >> 1);
}

/**
 * Computes a hash of the given `String`.
 * @param s The string to hash
 * @returns A hash number
 */
export function _hash(s: String): number {
  let hash = 0, i, chr, len;
  if (!s || s.length === 0) return hash;
  for (i = 0, len = s.length; i < len; i++) {
    chr   = s.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

/**
 * Computes a hash of the given `Object`.
 * @param o The object to hash
 * @returns A hash number
 */
function hash(o: Object): number {
  return o ? _hash(`${ObjectHash.MD5(o)}`) : 0;
}

/**
 * Smears a hash code (internally uses `Numbers.rotateLeft` to distribute hashes equally
 * to the lower order bits).
 * @param hashCode A hash number
 * @returns A smeared hash number
 */
function smear(hashCode: number): number {
  return C2 * Numbers.rotateLeft(hashCode * C1, 15);
}

/**
 * Hashes and smears the resulting hash code for an `Object`.
 * @param o The object to hash
 * @returns A hash number
 */
function smearedHash(o: Object): number {
  return smear(o ? hash(o) : 0);
}

/**
 * Computes an expected table size for use with hash based collections.  This table size
 * is larger for higher load factors and entries, but less than the maximum number of hash bins.
 * @param expectedEntries The expected number of entries in the collection
 * @param loadFactor The expected load factor of the collection
 * @returns A reasonable table size to use
 */
function closedTableSize(expectedEntries: number, loadFactor: number): number {
  let tableSize = _nearestLowerPowerOfTwo(expectedEntries);
  if (expectedEntries > loadFactor * tableSize) {
    tableSize <<= 1;
    return (tableSize > 0) ? tableSize : MAX_TABLE_SIZE;
  }
  return tableSize;
}

/**
 * Computes whether a hash based collection needs to be resized.  This is based
 * on the current size, total size and load factor of the collection.
 * @param size The current number of elements in the collection
 * @param tableSize The total spots available in the collection
 * @param loadFactor The load factor of the collection
 * @returns True if the collection needs resizing, false otherwise
 */
function needsResizing(size: number, tableSize: number, loadFactor: number): boolean {
  return size > loadFactor * tableSize && tableSize < MAX_TABLE_SIZE;
}

export default {
  closedTableSize,
  hash,
  needsResizing,
  smear,
  smearedHash,
}
