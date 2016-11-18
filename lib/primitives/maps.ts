import Collection from '../collections/collection';
import ImmutableMap from '../collections/immutablemap';

/**
 * Returns a map from the ith element of list to i.
 */
function indexMap<T>(list: Collection<T>): ImmutableMap<T, number> {
  const items = new Array<[T, number]>(list.length);
  let i = 0;
  for (let item of list) {
    items[i] = [item, i++];
  }
  return new ImmutableMap(...items);
}

export default {
  indexMap,
};
