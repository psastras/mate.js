import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import ArrayMultimap from '../../lib/collections/arraymultimap';

@suite class ArrayMultimapTest {

  @test 'basic storing and retrieving entries'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 5);
    expect(map.get('foo')).to.deep.eq([3]);
    expect(map.get('bar')).to.deep.eq([5]);
    expect(map.size).to.eq(2);
  }
  
  @test 'equal keys should store multiple values'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 2)
      .set('foo', 5);
    expect(map.size).to.eq(1);
    expect(map.get('foo')).to.deep.eq([2, 5]);
  }

  @test 'equal key values should be stored'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 2)
      .set('foo', 2);
    expect(map.size).to.eq(1);
    expect(map.get('foo')).to.deep.eq([2, 2]);
  }

  @test 'deleting a key should remove the entry'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3);
    map.delete('foo', 3);
    expect(map.size).to.eq(0);
    expect(map.has('foo')).to.be.false;
  }

  @test 'should be able to check if a key exists'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3);
    expect(map.has('foo')).to.be.true;
    expect(map.has('bar')).to.be.false;
  }

  @test 'clearing the map should remove all entries'() {
    const map = new ArrayMultimap<string, number>()
      .set('test', 3)
      .set('test', 4)
      .set('test2', 1);
    expect(map.size).to.eq(2);
    map.clear();
    expect(map.size).to.eq(0);
  }

  @test 'should handle null keys and values'() {
    const map = new ArrayMultimap<number, number>()
      .set(null, 3)
      .set(3, null);

    expect(map.get(null)).to.deep.eq([3]);
    expect(map.has(null)).to.be.true;

    map.set(null, null);
    expect(map.get(null)).to.deep.eq([3, null]);

    map.delete(null, null);
    expect(map.has(null)).to.be.true;
    expect(map.get(null)).to.deep.eq([3]);
  }

  @test 'should be able to delete non-existent keys'() {
    const map = new ArrayMultimap<string, number>();
    expect(map.delete('foo', 3)).to.be.false;
  }

  @test 'should return undefined on retrieving non-existent keys'() {
    const map = new ArrayMultimap<string, number>();
    expect(map.get('foo')).to.be.undefined;
  }

  @test 'should be able to iterate through the entries'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.entries();
    expect(itr.next()).to.deep.eq({ value: ['foo', [3]], done: false });
    expect(itr.next()).to.deep.eq({ value: ['bar', [2]], done: false });
    expect(itr.next()).to.deep.eq({ value: ['too', [4]], done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });
  }

  @test 'should be able to iterate through the keys'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.keys();
    expect(itr.next()).to.deep.eq({ value: 'foo', done: false });
    expect(itr.next()).to.deep.eq({ value: 'bar', done: false });
    expect(itr.next()).to.deep.eq({ value: 'too', done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });
  }

  @test 'should be able to iterate through the values'() {
    const map = new ArrayMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.values();
    expect(itr.next()).to.deep.eq({ value: [3], done: false });
    expect(itr.next()).to.deep.eq({ value: [2], done: false });
    expect(itr.next()).to.deep.eq({ value: [4], done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });
  }
}