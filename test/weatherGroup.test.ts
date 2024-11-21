/* eslint-disable sonarjs/no-duplicate-string */
import {describe, expect, it} from 'vitest';
import {getWeatherV2Description} from '../src/';

describe('weather groups', () => {
	it('should get weather type key from number', () => {
		expect(getWeatherV2Description(200).unwrap()).to.be.eq('thunderstorm_with_light_rain');
	});
});
