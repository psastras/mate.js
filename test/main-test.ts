import { suite, test, slow, timeout, skip, only } from 'mocha-typescript';
import { expect } from 'chai';
import { Hello } from '../lib/main';

@suite class MainTest {
    @test "world"() {
        const hello = new Hello();
        expect(hello.world()).to.eq('world');
    }
}