import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import MapMultiset from '../../lib/collections/mapmultiset';

@suite class MapMultisetTest {

  @test 'basic storing and retrieving entries'() {
    const set = new MapMultiset<string>()
      .add('foo')
      .addMulti('bar', 3);
    expect(set.count('foo')).to.eq(1);
    expect(set.count('bar')).to.eq(3);
    expect(set.size).to.eq(4);
    expect(set.length).to.eq(2);
  }

  @test 'should not be able to add less than 1 item'() {
    const set = new MapMultiset<string>();
    expect(() => set.addMulti('foo', 0)).to.throw(Error);
  }

  @test 'adding duplicate entries should increase the count'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 2)
      .addMulti('foo', 5);
    expect(set.count('foo')).to.eq(7);
    expect(set.size).to.eq(7);
    expect(set.length).to.eq(1);
  }

  @test 'should be able to modify the count directly'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 2);
    set.setCount('foo', 7);
    expect(set.count('foo')).to.eq(7);
    expect(set.size).to.eq(7);
    expect(set.length).to.eq(1);
  }

  @test 'should be able to modify the count of a non existent item directly'() {
    const set = new MapMultiset<string>();
    expect(set.count('foo')).to.eq(0);

    set.setCount('foo', 7);
    expect(set.count('foo')).to.eq(7);
    expect(set.size).to.eq(7);
    expect(set.length).to.eq(1);

    set.setCount('foo', 3);
    expect(set.count('foo')).to.eq(3);
    expect(set.size).to.eq(3);
    expect(set.length).to.eq(1);
  }

  @test 'should not be able to zero out the count of an item directly'() {
    const set = new MapMultiset<string>();
    expect(() => set.setCount('foo', 0)).to.throw(Error);
  }

  @test 'deleting an item should decrement the count'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3);
    set.delete(['foo', 1]);
    expect(set.count('foo')).to.eq(2);
  }

  @test 'deleting the last item should not let the count go negative'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3);
    set.deleteMulti('foo', 10);
    expect(set.count('foo')).to.eq(0);
    expect(set.size).to.eq(0);
    expect(set.length).to.eq(0);
  }

  @test 'should be able to check if an item exists'() {
    const set = new MapMultiset<string>();
    set.push(['foo', 3]);
    expect(set.has('foo')).to.be.true;
    set.deleteMulti('foo', 3);
    expect(set.has('foo')).to.be.false;
  }

  @test 'clearing the set should remove all itmes'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3);
    expect(set.size).to.eq(3);
    expect(set.length).to.eq(1);
    set.clear();
    expect(set.size).to.eq(0);
    expect(set.length).to.eq(0);
  }

  @test 'should handle null items'() {
    const set = new MapMultiset<string>()
      .add(null)
      .addMulti(null, 2);

    expect(set.count(null)).to.eq(3);
    expect(set.has(null)).to.be.true;

    set.deleteMulti(null, 1);
    expect(set.count(null)).to.eq(2);
  }

  @test 'should be able to delete non-existent items'() {
    const set = new MapMultiset<string>();
    expect(set.deleteMulti('foo')).to.be.false;
  }

  @test 'should be able to iterate through the entries'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3)
      .addMulti('bar', 2)
      .addMulti('too', 4);
    const itr = set.entries();
    expect(itr.next()).to.deep.eq({ value: ['foo', 3], done: false });
    expect(itr.next()).to.deep.eq({ value: ['bar', 2], done: false });
    expect(itr.next()).to.deep.eq({ value: ['too', 4], done: false });
    expect(itr.next()).to.deep.eq({ value: undefined, done: true });

    let i = 0;
    for (let entry of set) i++;
    expect(i).to.eq(3);
  }

  @test 'should be able to apply a function to the set'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3)
      .addMulti('bar', 2)
      .addMulti('too', 4);

    const values = [];
    set.forEach((val, idx, map) => { values.push(val) });
    expect(values).to.deep.eq([['foo', 3], ['bar', 2], ['too', 4]]);
  }

  @test 'should be able to get a set of elements'() {
    const set = new MapMultiset<string>()
      .addMulti('foo', 3)
      .addMulti('bar', 2);

    expect(set.elementSet()).to.be.deep.eq(new Set().add('foo').add('bar'));
  }
}
