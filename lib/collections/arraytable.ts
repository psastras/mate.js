import AbstractTable from './abstracttable';
import ImmutableList from './immutablelist';
import ImmutableMap from './immutablemap';
import Maps from '../primitives/maps';

export abstract class ArrayMap<K, T> {
  private readonly keyIndex: ImmutableMap<K, number>;

  constructor(keyIndex: ImmutableMap<K, number>) {
    this.keyIndex = keyIndex;
  }

  public keySet(): Set<K> {
    return this.keyIndex.keySet();
  }

  public getKey(index: number): K {
    return this.keyIndex.keySet().toArray()[index];
  }

  public abstract getValue(index: number): T;

  public abstract setValue(index: number, value: T): this;

  public get size(): number {
    return this.keyIndex.size;
  }

  public isEmpty(): boolean {
    return this.keyIndex.isEmpty();
  }

  public hasKey(key: K): boolean {
    return this.keyIndex.has(key);
  }

  public get(key: K): T {
    const index = this.keyIndex.get(key);
    return index ? this.getValue(index) : null;
  }

  public set(key: K, value: T): this {
    const index = this.keyIndex.get(key);
    if (!index) {
      throw new Error(`Attempted to set key: ${key} which is in the key set.`);
    }
    return this.setValue(index, value);
  }

}

/**
 * Fixed-size {@link Table} implementation backed by a two-dimensional array.
 *
 * @param R The row key type
 * @param C The column key type
 * @param T The stored element type
 */
class ArrayTable<R, C, T> extends AbstractTable<R, C, T> {

  private col = class extends ArrayMap<R, T> {
    private readonly columnIndex: number;

    constructor(rowKeyToIndex: ImmutableMap<R, number>, columnIndex: number) {
      super(rowKeyToIndex);
      this.columnIndex = columnIndex;
    }

    public getValue(index: number): T {
      return this.get(index, this.columnIndex);
    }
  };

  private readonly rowList: ImmutableList<R>;
  private readonly columnList: ImmutableList<C>;

  private readonly rowKeyToIndex: ImmutableMap<R, number>;
  private readonly columnKeyToIndex: ImmutableMap<C, number>;
  private readonly array: Array<Array<T>>;

  constructor(rowKeys: Iterable<R>, columnKeys: Iterable<C>) {
    super();
    this.rowList = new ImmutableList(...rowKeys);
    this.columnList = new ImmutableList(...columnKeys);
    this.rowKeyToIndex = Maps.indexMap(this.rowList);
    this.columnKeyToIndex = Maps.indexMap(this.columnList);

    this.array = new Array<Array<T>>(this.rowList.length);
    for (let i = 0; i < this.array.length; i++) {
      this.array[i] = new Array<T>(this.columnList.length);
    }
  }

  /** @inheritdoc */
  public get size(): number {
    return this.rowList.length * this.columnList.length;
  }

  /** @inheritdoc */
  public clear(): void {
    for (let row of this.array) {
      row.fill(null);
    }
  }

  /** @inheritdoc */
  public row(row: R): Map<C, T> {
    return null;
  }

  /** @inheritdoc */
  public column(col: C): Map<C, T> {
    const index = this.columnKeyToIndex.get(col);
    return index ? new ImmutableMap<C, T>() : null;
  }

  /** @inheritdoc */
  public rowMap(): Map<R, Map<C, T>> {
    return null;
  }

  /** @inheritdoc */
  public columnMap(): Map<C, Map<R, T>> {
    return null;
  }

  /** @inheritdoc */
  public values(): IterableIterator<T> {
    return null;
  }

  /**
   * Returns, as an immutable list, the row keys provided when the table was
   * constructed, including those that are mapped to null values only.
   */
  public get rowKeyList(): ImmutableList<R> {
    return this.rowKeyList;
  }

  /**
   * Returns, as an immutable list, the column keys provided when the table was
   * constructed, including those that are mapped to null values only.
   */
  public get columnKeyList(): ImmutableList<C> {
    return this.columnKeyList;
  }

  public at(rowIndex: number, columnIndex: number): T {
    return this.array[rowIndex][columnIndex];
  }

  public set(rowIndex: number, columnIndex: number, value: T): this {
    this.array[rowIndex][columnIndex] = value;
    return this;
  }

}

class Column<R, T> extends ArrayMap<R, T> {

  private readonly columnIndex: number;

  constructor(rowKeyToIndex: ImmutableMap<R, number>, columnIndex: number) {
    super(rowKeyToIndex);
    this.columnIndex = columnIndex;
  }

  // public getValue(index: number): T {
  //   return this.get(index, this.columnIndex);
  // }

  // public setValue(index: number, value: T): this {

  // }
}

export default ArrayTable;
