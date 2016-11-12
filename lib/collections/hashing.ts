import Numbers from '../primitives/numbers';

const MAX_TABLE_SIZE = Math.pow(2, 52);
const C1 = 0xcc9e2d51;
const C2 = 0x1b873593;

export function _nearestLowerPowerOfTwo(x: number): number {
    x = x | (x >> 1);
    x = x | (x >> 2);
    x = x | (x >> 4);
    x = x | (x >> 8);
    x = x | (x >> 16);
    return x - (x >> 1);
}

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

function hash(o: Object): number {
  return o ? _hash(JSON.stringify(o)) : 0;
}

function smear(hashCode: number): number {
  return C2 * Numbers.rotateLeft(hashCode * C1, 15);
}

function smearedHash(o: Object): number {
  return smear(o ? hash(o) : 0);
}

function closedTableSize(expectedEntries: number, loadFactor: number) {
  let tableSize = _nearestLowerPowerOfTwo(expectedEntries);
  if (expectedEntries > loadFactor * tableSize) {
    tableSize <<= 1;
    return (tableSize > 0) ? tableSize : MAX_TABLE_SIZE;
  }
  return tableSize;
}

function needsResizing(size: number, tableSize: number, loadFactor: number) {
  return size > loadFactor * tableSize && tableSize < MAX_TABLE_SIZE;
}

export default {
  closedTableSize,
  hash,
  needsResizing,
  smear,
  smearedHash,
}
