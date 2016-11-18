/**
 * A collection that associates an ordered pair of keys, called a row key and a
 * column key, with a single value. A table may be sparse, with only a small
 * fraction of row key / column key pairs possessing a corresponding value.
 *
 * @param R The row key type
 * @param C The column key type
 * @param T The stored element type
 */
interface Table<R, C, T> {

  readonly [Symbol.toStringTag]: 'Table';

  /**
   * The size (number of entries) in the table.
   */
  size: number;

  /**
   * Checks if an item at the row and column exists in the table.
   * @param row The row to check
   * @param col The column to check
   * @returns True if an item exists, false otherwise
   */
  has(row: R, col: C): boolean;

  /**
   * Checks if a row exists in the table.
   * @param row The row to check
   * @returns True if the row exists, false otherwise
   */
  hasRow(row: R): boolean;

  /**
   * Checks if a column exists in the table.
   * @param col The column to check
   * @returns True if the column exists, false otherwise
   */
  hasColumn(col: C): boolean;

  /**
   * Checks if a value exists in the table.
   * @param item The value to check
   * @returns True if the value exists, false otherwise
   */
  hasValue(item: T): boolean;

  /**
   * Clears all entries in the table.
   */
  clear(): void;

  /**
   * Retrieves an item from the table, if it exists.
   * @param row The row of the value
   * @param col The column of the value
   * @returns The value if it exists, null otherwise
   */
  get(row: R, col: C): T;

  /**
   * Inserts an value into the table.
   * @param row The row of the value
   * @param col The column of the value
   * @param item The value to insert
   */
  set(row: R, col: C, item: T): this;

  /**
   * Deletes a value from the table.
   * @param row The row of the value
   * @param col The column of the value
   * @returns True if a value is deleted, false otherwise
   */
  delete(row: R, col: C): boolean;

  /**
   * Returns a view of all items in the given row.
   * @param row The row to retrieve
   * @returns A map of column to item for the given row
   */
  row(row: R): Map<C, T>;

  /**
   * Returns a view of all items in the given column.
   * @param col The column to retrieve
   * @returns A map of row to item for the given column
   */
  column(col: C): Map<C, T>;

  /**
   * Returns a view which maps row keys to columns and their values.
   */
  rowMap(): Map<R, Map<C, T>>;

  /**
   * Returns a view which maps column keys to rows and their values.
   */
  columnMap(): Map<C, Map<R, T>>;

  /**
   * Returns an iterator over the values of the map.
   * @returns An iterator over the values
   */
  values(): IterableIterator<T>;
}

interface Cell<R, C, T> {

  /**
   * Returns the row key of this cell.
   */
  getRow(): R;

  /**
   * Returns the column key of this cell.
   */
  getColumn(): C;

  /**
   * Returns the value of this cell.
   */
  getValue(): T;
}

export default Table;
