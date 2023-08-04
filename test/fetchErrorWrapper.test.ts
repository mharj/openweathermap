/* eslint-disable sonarjs/no-duplicate-string */
import 'mocha';
import {expect} from 'chai';
import {fetchErrorWrapper} from '../src/';

describe('fetchErrorWrapper', () => {
	it('should get valid error types', () => {
		expect(fetchErrorWrapper(new TypeError('message')))
			.to.be.instanceOf(TypeError)
			.and.have.property('message', 'message');
		expect(fetchErrorWrapper(new DOMException('message')))
			.to.be.instanceOf(DOMException)
			.and.have.property('message', 'message');
		expect(fetchErrorWrapper('message')).to.be.instanceOf(TypeError).and.have.property('message', 'Unknown error: message');
	});
});
