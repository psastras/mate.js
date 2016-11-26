/**
 * Helper functions to operate on `Object` types.
 */

import * as deepequal from 'deep-equal';

/**
 * Determines whether two possibly-null objects are equal.
 * @param a The first object to compare.
 * @param b The second object to compare.
 * @returns True if the objects are equal, false otherwise.
 */
function isEqual(a: Object, b: Object) {
  return deepequal(a, b);
}

export default {
  isEqual,
};
