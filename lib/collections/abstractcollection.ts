import Collection from './collection';

/**
 * An abstract collection partially implements the {@link Collection} interface,
 * making it easier for subclasses to fully implement the {@link Collection}.
 * 
 * @param T The item type
 */
abstract class AbstractCollection<T> implements Collection<T> {

  /** @inheritdoc */
  public abstract readonly length: number;

  /** @inheritdoc */
  public abstract add(item: T): this;

  /** @inheritdoc */
  public addAll(items: Collection<T>): this {
    for (let item of items) {
      this.add(item);
    }
    return this;
  }

  /** @inheritdoc */
  public abstract delete(item: T): boolean;

  /** @inheritdoc */
  public deleteAll(items: Collection<T>): boolean {
    let deleted = false;
    for (let item of items) {
      deleted = deleted || this.delete(item);
    }
    return deleted;
  }

  /** @inheritdoc */
  public abstract has(item: T): boolean;

  /** @inheritdoc */
  public hasAll(items: Collection<T>): boolean {
    for (let item of items) {
      if (!this.has(item)) {
        return false;
      }
    }
    return true;
  }

  /** @inheritdoc */
  public isEmpty(): boolean {
    return this.length === 0;
  }

  /** @inheritdoc */
  public toArray(): Array<T> {
    const array = [];
    for (let item of this) {
      array.push(item);
    }
    return array;
  }

  /** @inheritdoc */
  public abstract clear(): void;

  /** @inheritdoc */
  public abstract [Symbol.iterator](): IterableIterator<T>;

}

export default AbstractCollection;
