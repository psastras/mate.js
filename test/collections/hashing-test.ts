import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import Hashing, { _nearestLowerPowerOfTwo, _hash } from '../../lib/collections/hashing';

@suite class HashingTest {

  @test 'get nearest lower power of two'() {
    expect(_nearestLowerPowerOfTwo(8)).to.eq(8);
    expect(_nearestLowerPowerOfTwo(4)).to.eq(4);
    expect(_nearestLowerPowerOfTwo(3)).to.eq(2);
    expect(_nearestLowerPowerOfTwo(1)).to.eq(1);
    expect(_nearestLowerPowerOfTwo(0)).to.eq(0);
  }

  @test 'hashing strings'() {
    expect(_hash('foo')).to.eq(_hash('foo'));
    expect(_hash('foo')).to.not.eq(_hash('Foo'));
    expect(_hash('')).to.eq(_hash(''));
    expect(_hash(null)).to.eq(_hash(''));
  }

  @test 'hashing objects'() {
    expect(Hashing.hash({ key: 'val' })).to.eq(Hashing.hash({ key: 'val' }));
    expect(Hashing.hash({ key: 'val' })).to.not.eq(Hashing.hash({ key: 'val1' }));
    expect(Hashing.hash({ key: 'val' })).to.not.eq(Hashing.hash({ key1: 'val' }));
    expect(Hashing.hash({})).to.eq(Hashing.hash({}));
    expect(Hashing.hash(null)).to.eq(Hashing.hash(null));
    expect(Hashing.hash(null)).to.not.eq(Hashing.hash({}));
  }

  @test 'closed table size with large entries'() {
    expect(Hashing.closedTableSize(200, 1)).to.eq(256);
    expect(Hashing.closedTableSize(256, 1)).to.eq(256);
  }

}
