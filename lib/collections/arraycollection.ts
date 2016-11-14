import * as _ from 'lodash';
import Collection from './collection';

/**
 * A {@link Collection} backed by a standard javascript array.
 * 
 * @param T The element type
 */
class ArrayCollection<T> extends Array<T> implements Collection<T> {
  /**
   * @inheritdoc
   */
  public delete(...items: T[]): boolean {
    let itemsRemoved = 0;
    _.remove(this, item => {
      const shouldRemove = _.indexOf(items, item) !== -1;
      if (shouldRemove) {
        itemsRemoved++;
      }
      return shouldRemove;
    });
    return itemsRemoved > 0;
  }
}

export default ArrayCollection;
