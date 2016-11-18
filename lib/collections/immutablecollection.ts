import AbstractCollection from './abstractcollection';

/**
 * An abstract  immutable collection partially implements the {@link AbstractCollection} class,
 * making it easier for subclasses to fully implement the {@link ImmutableCollection}.
 *
 * @param T The item type
 */
abstract class ImmutableCollection<T> extends AbstractCollection<T> {

  protected readonly errorMessage = 'Cannot modify an immutable collection.';

  /** Lazily intialized when {@link toArray} is called */
  protected _toArray;

  /** @inheritdoc */
  public add(item: T): this {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public delete(item: T): boolean {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public clear(): void {
    throw new Error(this.errorMessage);
  }

  /** @inheritdoc */
  public toArray(): Array<T> {
    if (!this._toArray) {
      this._toArray = super.toArray();
    }
    return this._toArray;
  }
}

export default ImmutableCollection;
