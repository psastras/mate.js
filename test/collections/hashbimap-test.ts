import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import HashBiMap from '../../lib/collections/hashbimap';

@suite class HashBiMapTest {

  @test 'basic storing and retrieving entries'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 5);

    expect(map.get('foo')).to.eq(3);
    expect(map.get('bar')).to.eq(5);
    expect(map.size).to.eq(2);
  }

  @test 'basic storing and retrieving entries on the invserse map'() {
    const map = new HashBiMap<number, string>()
      .set(3, 'foo')
      .set(5, 'bar')
      .inverse();

    expect(map.get('foo')).to.eq(3);
    expect(map.get('bar')).to.eq(5);
    expect(map.size).to.eq(2);
  }
  
  @test 'equal keys should cause an exception on entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 2);
    expect(map.size).to.eq(1);
    expect(() => map.set('foo', 5)).to.throw(Error);
  }

  @test 'force setting equal keys should overwrite the old entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 2);
    expect(map.size).to.eq(1);
    map.set('foo', 5, true);
    expect(map.size).to.eq(1);
    expect(map.get('foo')).to.eq(5);
  }

  @test 'equal values should cause an exception on entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 2);
    expect(map.size).to.eq(1);
    expect(() => map.set('bar', 2)).to.throw(Error);
  }

  @test 'force setting equal values should overwrite the old entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 2);
    expect(map.size).to.eq(1);
    map.set('bar', 2, true);
    expect(map.size).to.eq(1);
    expect(map.get('bar')).to.eq(2);
  }

  @test 'force setting equal keys and values should overwrite the old entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 2);
    expect(map.size).to.eq(1);
    map.set('foo', 2, true);
    expect(map.size).to.eq(1);
    expect(map.get('foo')).to.eq(2);
  }

  @test 'deleting a key should remove the entry'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3);
    map.delete('foo');
    expect(map.size).to.eq(0);
    expect(map.has('foo')).to.be.false;
  }

  @test 'should be able to check if a key exists'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3);
    expect(map.has('foo')).to.be.true;
    expect(map.has('bar')).to.be.false;
  }

  @test 'should be able to check if a value exists'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3);
    expect(map.hasValue(3)).to.be.true;
    expect(map.hasValue(4)).to.be.false;
  }

  @test 'clearing the map should remove all entries'() {
    const map = new HashBiMap<string, number>()
      .set('test', 3)
      .set('test2', 1);
    expect(map.size).to.eq(2);
    map.clear();
    expect(map.size).to.eq(0);
  }

  @test 'clearing the inverse map should remove all entries'() {
    const map = new HashBiMap<string, number>()
      .set('test', 3)
      .set('test2', 1);
    expect(map.size).to.eq(2);
    map.inverse().clear();
    expect(map.size).to.eq(0);
  }

  @test 'should be able to rehash and allocate growing maps'() {
    const numEntries = 256;
    const map = new HashBiMap<number, number>(2);
    for (let i = 0; i < numEntries; i++) {
      map.set(i, numEntries-i);
    }

    expect(map.size).to.eq(numEntries);
    for (let i = 0; i < numEntries; i++) {
      expect(map.get(i)).to.eq(numEntries-i);
    }
  }

  @test 'should handle null keys and values'() {
    const map = new HashBiMap<number, number>()
      .set(null, 3)
      .set(3, null);

    expect(map.get(null)).to.eq(3);
    expect(map.hasValue(null)).to.be.true;

    map.set(null, null, true);
    expect(map.get(null)).to.eq(null);

    map.delete(null);
    expect(map.has(null)).to.be.false;
  }

  @test 'should be able to delete non-existent keys'() {
    const map = new HashBiMap<string, number>();
    expect(map.delete('foo')).to.be.false;
  }

  @test 'should return undefined on retrieving non-existent keys'() {
    const map = new HashBiMap<string, number>();
    expect(map.get('foo')).to.be.undefined;
  }

  @test 'should be able to invert the hash map'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3);
    const inverted = map.inverse();
    expect(map.get('foo')).to.eq(3);
    expect(inverted.get(3)).to.eq('foo');
  }

  @test 'should be able to add and remove entries from an inverted hash map'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3);
    const inverted = map.inverse();
    expect(map.get('foo')).to.eq(3);
    expect(inverted.get(3)).to.eq('foo');

    expect(inverted.delete(3)).to.be.true;
    expect(inverted.has(3)).to.be.false;
    expect(map.has('foo')).to.be.false;

    inverted.set(5, 'bar');
    expect(inverted.has(5)).to.be.true;
    expect(map.has('bar')).to.be.true;
  }

  @test 'should be able to iterate through the entries'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.entries();
    expect(itr.next()).to.deep.eq({ value: ['foo', 3], done: false });
    expect(itr.next()).to.deep.eq({ value: ['bar', 2], done: false });
    expect(itr.next()).to.deep.eq({ value: ['too', 4], done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let entry of map.entries()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the keys'() {
    const map = new HashBiMap<string, number>()
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
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.values();
    expect(itr.next()).to.deep.eq({ value: 3, done: false });
    expect(itr.next()).to.deep.eq({ value: 2, done: false });
    expect(itr.next()).to.deep.eq({ value: 4, done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let key of map.values()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the inverse entries'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.inverse().entries();
    expect(itr.next()).to.deep.eq({ value: [3, 'foo'], done: false });
    expect(itr.next()).to.deep.eq({ value: [2, 'bar'], done: false });
    expect(itr.next()).to.deep.eq({ value: [4, 'too'], done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let entry of map.inverse().entries()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the inverse keys'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.inverse().keys();
    expect(itr.next()).to.deep.eq({ value: 3, done: false });
    expect(itr.next()).to.deep.eq({ value: 2, done: false });
    expect(itr.next()).to.deep.eq({ value: 4, done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let key of map.inverse().keys()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through the inverse values'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    const itr = map.inverse().values();
    expect(itr.next()).to.deep.eq({ value: 'foo', done: false });
    expect(itr.next()).to.deep.eq({ value: 'bar', done: false });
    expect(itr.next()).to.deep.eq({ value: 'too', done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let value of map.inverse().values()) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to iterate through an empty map and its inverse'() {
    const map = new HashBiMap<string, number>();
    const itr = map.entries();
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });
    const iitr = map.inverse().entries();
    expect(iitr.next()).to.deep.eq({ value: undefined, done: true });
  }

  @test 'should be able to apply a function to a map'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    
    const values = [];
    map.forEach((val, idx, map) => { values.push(val) });
    expect(values).to.deep.eq([3, 2, 4]);
  }

  @test 'should be able to apply a function to an inverse map'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2)
      .set('too', 4);
    
    const keys = [];
    map.inverse().forEach((val, idx, map) => { keys.push(val) });
    expect(keys).to.deep.eq(['foo', 'bar', 'too']);
  }

  @test 'the inverse of the inverse map should be the original'() {
    const map = new HashBiMap<string, number>()
      .set('foo', 3)
      .set('bar', 2);
    expect(map.inverse().inverse()).to.eq(map);
  }
}