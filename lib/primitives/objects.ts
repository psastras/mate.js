/**
 * Helper functions to operate on `Object` types.
 */

import * as _ from 'lodash';

/**
 * Determines whether two possibly-null objects are equal.
 * @param a The first object to compare.
 * @param b The second object to compare.
 * @returns True if the objects are equal, false otherwise.
 */
function isEqual(a: Object, b: Object) {
  return _.isEqual(a, b);
}

export default {
  isEqual,
};
