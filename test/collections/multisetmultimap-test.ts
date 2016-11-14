import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import MultisetMultimap from '../../lib/collections/multisetmultimap';
import Multiset from '../../lib/collections/multiset';

@suite class ArrayMultimapTest {

  @test 'basic storing and retrieving entries'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 5);
    expect(map.get('foo').has(3)).is.true;
    expect(map.get('bar').has(5)).is.true;
    expect(map.size).to.eq(2);
  }

  @test 'equal keys should store multiple values'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 2)
      .set('foo', 5);
    expect(map.size).to.eq(1);
    expect(map.get('foo').has(2)).is.true;
    expect(map.get('foo').has(5)).is.true;
  }

  @test 'equal key values should be stored'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 2)
      .set('foo', 2);
    expect(map.size).to.eq(1);
    expect(map.get('foo').count(2)).is.eq(2);
  }

  @test 'deleting a key should remove the entry'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3);
    map.delete('foo', 3);
    expect(map.size).to.eq(0);
    expect(map.has('foo')).to.be.false;
  }

  @test 'should be able to check if a key exists'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3);
    expect(map.has('foo')).to.be.true;
    expect(map.has('bar')).to.be.false;
  }

  @test 'clearing the map should remove all entries'() {
    const map = new MultisetMultimap<string, number>()
      .set('test', 3)
      .set('test', 4)
      .set('test2', 1);
    expect(map.size).to.eq(2);
    map.clear();
    expect(map.size).to.eq(0);
  }

  @test 'should handle null keys and values'() {
    const map = new MultisetMultimap<number, number>()
      .set(null, 3)
      .set(3, null);

    expect(map.get(null).has(3)).to.be.true;
    expect(map.has(null)).to.be.true;

    map.set(null, null);
    expect(map.get(null).has(3)).to.be.true;
    expect(map.get(null).has(null)).to.be.true;

    map.delete(null, null);
    expect(map.has(null)).to.be.true;
    expect(map.get(null).has(3)).to.be.true;
  }

  @test 'should be able to delete non-existent keys'() {
    const map = new MultisetMultimap<string, number>();
    expect(map.delete('foo', 3)).to.be.false;
  }

  @test 'should return undefined on retrieving non-existent keys'() {
    const map = new MultisetMultimap<string, number>();
    expect(map.get('foo')).to.be.undefined;
  }

  @test 'should be able to iterate through the entries'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.entries();
    expect(itr.next().value.entries().next().value[1]).to.eq('foo');
    expect(itr.next().value.entries().next().value[1]).to.eq('bar');
    expect(itr.next().value.entries().next().value[1]).to.eq('too');
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let entry of map.entries()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the keys'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.keys();
    expect(itr.next()).to.deep.eq({ value: 'foo', done: false });
    expect(itr.next()).to.deep.eq({ value: 'bar', done: false });
    expect(itr.next()).to.deep.eq({ value: 'too', done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let key of map.keys()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the values'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.values();
    expect(itr.next().value.entries().next().value).to.eq(3);
    expect(itr.next().value.entries().next().value).to.eq(2);
    expect(itr.next().value.entries().next().value).to.eq(4);
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let value of map.values()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to apply a function to a map'() {
    const map = new MultisetMultimap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);

    const values = [];
    map.forEach((val, idx, _) => { values.push(val.entries().next().value); });
    expect(values).to.deep.eq([3, 2, 4]);
  }
}
