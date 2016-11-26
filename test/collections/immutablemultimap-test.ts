import test from 'ava';
import { expect } from 'chai';
import ImmutableMultimap from '../../lib/collections/immutablemultimap';

test('should be able to construct a map with data', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2], ['foo', 4]
  );
  expect(map.get('foo')).to.deep.eq([3, 4]);
  expect(map.get('bar')).to.deep.eq([2]);
  expect(map.size).to.eq(2);
});

test('should be not be able to clear the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  expect(() => map.clear()).to.throw(Error);
});

test('should be not be able to delete an item in the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  expect(() => map.delete('foo', 2)).to.throw(Error);
});

test('should be able to apply a function to a map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  const values = [];
  map.forEach((val, idx, _) => { values.push(val); });
  expect(values).to.deep.eq([[3], [2]]);
});

test('should be able to get an item in the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  expect(map.get('foo')).to.deep.eq([3]);
});

test('should be able to check if an item is in the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  expect(map.has('foo')).to.be.true;
});

test('should be not be able to set an item in the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );
  expect(() => map.set('voo', 4)).to.throw(Error);
});

test('should be to iterate through the map', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );

  const entries = [];
  for (let entry of map) {
    entries.push(entry);
  }
  expect(entries).to.deep.eq([['foo', [3]], ['bar', [2]]]);
});

test('should be to iterate through the map entries', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );

  const entries = [];
  for (let entry of map.entries()) {
    entries.push(entry);
  }
  expect(entries).to.deep.eq([['foo', [3]], ['bar', [2]]]);
});

test('should be to iterate through the map keys', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );

  const keys = [];
  for (let key of map.keys()) {
    keys.push(key);
  }
  expect(keys).to.deep.eq(['foo', 'bar']);
});

test('should be to iterate through the map values', () => {
  const map = new ImmutableMultimap<string, number>(
    ['foo', 3], ['bar', 2]
  );

  const values = [];
  for (let value of map.values()) {
    values.push(value);
  }
  expect(values).to.deep.eq([[3], [2]]);
});

test('should be not be able to create a new colletion in the map', () => {
  const map = new ImmutableMultimap<string, number>();
  expect(() => map._createCollection()).to.throw(Error);
});
