import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import HashBiMap from '../../lib/collections/hashbimap';

@suite class HashBiMapTest {

  @test "storing and retrieving entries"() {
    const map = new HashBiMap<string, number>();
    map.set('foo', 3);
    map.set('bar', 5);

    expect(map.get('foo')).to.eql(3);
    expect(map.get('bar')).to.eql(5);
  }

}