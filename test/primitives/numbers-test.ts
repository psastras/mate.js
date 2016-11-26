import test from 'ava';
import { expect } from 'chai';
import Numbers from '../../lib/primitives/numbers';

test('rotate left', () => {
    expect(Numbers.rotateLeft(2, 4)).to.eq(32);
    expect(Numbers.rotateLeft(2, 8)).to.eq(512);
    expect(Numbers.rotateLeft(32, 4)).to.eq(512);
});

test('rotate right', () => {
    expect(Numbers.rotateRight(2, 32)).to.eq(2);
    expect(Numbers.rotateRight(2, 30)).to.eq(8);
    expect(Numbers.rotateRight(4, 28)).to.eq(64);
});
