import test from 'ava';
import { expect } from 'chai';
import ImmutableSet from '../../lib/collections/immutableset';

test('should be able to construct a set with data', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  expect(set.has('foo')).to.be.true;
  expect(set.has('bar')).to.be.true;
  expect(set.size).to.eq(2);
  expect(set.length).to.eq(2);
});

test('should be not be able to clear the set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  expect(() => set.clear()).to.throw(Error);
});

test('should be not be able to delete an item in the set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  expect(() => set.delete('foo')).to.throw(Error);
});

test('should be able to apply a function to a set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  const values = [];
  set.forEach((val, idx, _) => { values.push(val); });
  expect(values).to.deep.eq(['foo', 'bar']);
});

test('should be able to check if an item is in the set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  expect(set.has('foo')).to.be.true;
});

test('should be not be able to add an item in the set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );
  expect(() => set.add('voo')).to.throw(Error);
});

test('should be to iterate through the set', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );

  const entries = [];
  for (let entry of set) {
    entries.push(entry);
  }
  expect(entries).to.deep.eq(['foo', 'bar']);
});

test('should be to iterate through the set entries', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );

  const entries = [];
  for (let entry of set.entries()) {
    entries.push(entry);
  }
  expect(entries).to.deep.eq([['foo', 'foo'], ['bar', 'bar']]);
});

test('should be to iterate through the set keys', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );

  const keys = [];
  for (let key of set.keys()) {
    keys.push(key);
  }
  expect(keys).to.deep.eq(['foo', 'bar']);
});

test('should be to iterate through the set values', () => {
  const set = new ImmutableSet<string>(
    'foo', 'bar'
  );

  const values = [];
  for (let value of set.values()) {
    values.push(value);
  }
  expect(values).to.deep.eq(['foo', 'bar']);
});
