import _ from 'lodash';
import Table from './table';

/**
 * A {@link Table} which implements several methods to make it easier for subclasses
 * to fully implement the {@link Table} interface.
 *
 * @param R The row key type
 * @param C The column key type
 * @param T The stored element type
 */
abstract class AbstractTable<R, C, T> implements Table<R, C, T> {

  public readonly [Symbol.toStringTag]: 'Table';

  /** @inheritdoc */
  public abstract size: number;

  /** @inheritdoc */
  public has(row: R, col: C): boolean {
    const rowMapValues = this.rowMap().get(row);
    if (!rowMapValues) {
      return false;
    }
    return rowMapValues.has(col);
  }

  /** @inheritdoc */
  public hasRow(row: R): boolean {
    return this.rowMap() && this.rowMap().has(row);
  }

  /** @inheritdoc */
  public hasColumn(col: C): boolean {
    return this.columnMap() && this.columnMap().has(col);
  }

  /** @inheritdoc */
  public hasValue(item: T): boolean {
    for (let row of this.rowMap().values()) {
      for (let value of row.values()) {
        if (_.isEqual(item, value)) {
          return true;
        }
      }
    }
    return false;
  }

  /** @inheritdoc */
  public get(row: R, col: C): T {
    const rowValues = this.rowMap().get(row);
    return rowValues ? rowValues.get(col) : null;
  }

  /** @inheritdoc */
  public abstract clear(): void;

  /** @inheritdoc */
  public set(row: R, col: C, item: T): this {
    this.row(row).set(col, item);
    return this;
  }

  /** @inheritdoc */
  public delete(row: R, col: C): boolean {
    const rowValues = this.rowMap().get(row);
    if (!rowValues) {
      return false;
    }
    return rowValues.delete(col);
  }

  /** @inheritdoc */
  public abstract row(row: R): Map<C, T>;

  /** @inheritdoc */
  public abstract column(col: C): Map<C, T>;

  /** @inheritdoc */
  public abstract rowMap(): Map<R, Map<C, T>>;

  /** @inheritdoc */
  public abstract columnMap(): Map<C, Map<R, T>>;

  /** @inheritdoc */
  public abstract values(): IterableIterator<T>;
}

export default AbstractTable;
