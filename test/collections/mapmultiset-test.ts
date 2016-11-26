import test from 'ava';
import { expect } from 'chai';
import MapMultiset from '../../lib/collections/mapmultiset';

test('basic storing and retrieving entries', () => {
  const set = new MapMultiset<string>()
    .add('foo', 1)
    .add('bar', 3);
  expect(set.count('foo')).to.eq(1);
  expect(set.count('bar')).to.eq(3);
  expect(set.size).to.eq(4);
  expect(set.length).to.eq(2);
});

test('should not be able to add less than 1 item', () => {
  const set = new MapMultiset<string>();
  expect(() => set.add('foo', 0)).to.throw(Error);
});

test('adding duplicate entries should increase the count', () => {
  const set = new MapMultiset<string>()
    .add('foo', 2)
    .add('foo', 5);
  expect(set.count('foo')).to.eq(7);
  expect(set.size).to.eq(7);
  expect(set.length).to.eq(1);
});

test('should be able to modify the count directly', () => {
  const set = new MapMultiset<string>()
    .add('foo', 2);
  set.setCount('foo', 7);
  expect(set.count('foo')).to.eq(7);
  expect(set.size).to.eq(7);
  expect(set.length).to.eq(1);
});

test('should be able to modify the count of a non existent item directly', () => {
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
});

test('should not be able to zero out the count of an item directly', () => {
  const set = new MapMultiset<string>();
  expect(() => set.setCount('foo', 0)).to.throw(Error);
});

test('deleting an item should decrement the count', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3);
  set.delete('foo', 1);
  expect(set.count('foo')).to.eq(2);
});

test('deleting the last item should not let the count go negative', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3);
  set.delete('foo', 10);
  expect(set.count('foo')).to.eq(0);
  expect(set.size).to.eq(0);
  expect(set.length).to.eq(0);
});

test('should be able to check if an item exists', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3);
  expect(set.has('foo')).to.be.true;
  set.delete('foo', 3);
  expect(set.has('foo')).to.be.false;
});

test('clearing the set should remove all itmes', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3);
  expect(set.size).to.eq(3);
  expect(set.length).to.eq(1);
  set.clear();
  expect(set.size).to.eq(0);
  expect(set.length).to.eq(0);
});

test('should handle null items', () => {
  const set = new MapMultiset<string>()
    .add(null, 1)
    .add(null, 2);

  expect(set.count(null)).to.eq(3);
  expect(set.has(null)).to.be.true;

  set.delete(null, 1);
  expect(set.count(null)).to.eq(2);
});

test('should be able to delete non-existent items', () => {
  const set = new MapMultiset<string>();
  expect(set.delete('foo', 1)).to.be.false;
});

test('should be able to iterate through the entries', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3)
    .add('bar', 2)
    .add('too', 1);

  let keys = [];
  for (let entry of set) keys.push(entry);
  expect(keys).to.deep.eq(['foo', 'foo', 'foo', 'bar', 'bar', 'too']);
});

test('should be able to apply a function to the set', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3)
    .add('bar', 2)
    .add('too', 4);

  const values = [];
  set.forEach((val, idx, map) => { values.push(val); });
  expect(values).to.deep.eq(['foo', 'foo', 'foo', 'bar', 'bar', 'too', 'too', 'too', 'too']);
});

test('should be able to get a set of elements', () => {
  const set = new MapMultiset<string>()
    .add('foo', 3)
    .add('bar', 2);
  expect(set.elementSet().has('foo')).to.be.true;
  expect(set.elementSet().has('bar')).to.be.true;
});
