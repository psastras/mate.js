import test from 'ava';
import { expect } from 'chai';
import ImmutableList from '../../lib/collections/immutablelist';

test('should be able to construct a list with data', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );
  expect(list.has('foo')).to.be.true;
  expect(list.has('bar')).to.be.true;
  expect(list.length).to.eq(2);
});

test('should be not be able to clear the list', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );
  expect(() => list.clear()).to.throw(Error);
});

test('should be not be able to delete an item in the list', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );
  expect(() => list.delete('foo')).to.throw(Error);
});

test('should be able to check if an item is in the list', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );
  expect(list.has('foo')).to.be.true;
});

test('should be able to get an item in the list', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );
  expect(list.get(1)).to.be.eq('bar');
});

test('should be to iterate through the list', () => {
  const list = new ImmutableList<string>(
    'foo', 'bar'
  );

  const entries = [];
  for (let entry of list) {
    entries.push(entry);
  }
  expect(entries).to.deep.eq(['foo', 'bar']);
});
