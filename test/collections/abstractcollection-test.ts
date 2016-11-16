import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import AbstractCollection from '../../lib/collections/abstractcollection';

class ArrayCollection<T> extends AbstractCollection<T> {

  private array: Array<T>;

  constructor() {
    super();
    this.array = new Array<T>();
  }

  /** @inheritdoc */
  public get length(): number {
    return this.array.length;
  }

  /** @inheritdoc */
  public add(item: T): this {
    this.array.push(item);
    return this;
  }

  /** @inheritdoc */
  public delete(item: T): boolean {
    const idx = this.array.indexOf(item);
    if (idx >= 0) {
      this.array.splice(idx);
      return true;
    }
    return false;
  }

  /** @inheritdoc */
  public has(item: T): boolean {
    return this.array.indexOf(item) !== -1;
  }

  /** @inheritdoc */
  public clear(): void {
    this.array = new Array<T>();
  }

  /** @inheritdoc */
  public [Symbol.iterator](): IterableIterator<T> {
    let pointer = this.array.entries();
    return {
      next(): IteratorResult<T> {
        const value = pointer.next();
        if (value.done) {
          return { done: true, value: undefined };
        }
        return {
          done: false,
          value: value.value[1],
        };
      },

      [Symbol.iterator](): IterableIterator<T> {
        return this;
      },
    };
  }
}

@suite class AbstractCollectionTest {

  @test 'should be able to add a collection'() {
    const array = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    const toAdd = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    array.addAll(toAdd);
    expect(array.toArray()).to.deep.eq([0, 1, 2, 0, 1, 2]);
  }

  @test 'should be able to delete a collection'() {
    const array = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    const toRemove = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    array.deleteAll(toRemove);
    expect(array.isEmpty()).to.be.true;
  }

   @test 'should be able check if it contains a collection'() {
    const array = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    const toCheck = new ArrayCollection<number>()
      .add(0)
      .add(1)
      .add(2);
    expect(array.hasAll(toCheck)).to.be.true;
    toCheck.add(3);
    expect(array.hasAll(toCheck)).to.be.false;
  }
}
