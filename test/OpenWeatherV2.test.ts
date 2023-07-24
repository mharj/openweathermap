/* eslint-disable no-unused-expressions */
import 'mocha';
import {getWeatherV2Description, OpenWeatherV2, WeatherDataV2, weatherDataV2Schema} from '../src/';
import {expect} from 'chai';
import {ExpireCache} from '@avanio/expire-cache';
import {Result} from 'mharj-result';
import {unitTestApiV2} from './lib/unitTestApi';

let weather: OpenWeatherV2;
const cache = new ExpireCache<WeatherDataV2>(undefined, undefined, 900000); // 15 minutes in cache
const currentId = 2643743; // London

describe('OpenWeatherV2', () => {
	before(() => {
		weather = new OpenWeatherV2('not needed on testing', cache, unitTestApiV2); // 15 minutes in cache
	});

	describe('getWeatherById', () => {
		it('should get data with getWeatherById', async () => {
			expect(cache.get(`id:${currentId}:undefined:undefined`)).to.be.undefined;
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherById(currentId);
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
			if (res.isOk) {
				expect(getWeatherV2Description(res.ok().weather[0]?.id).unwrapOr('unknown')).to.equal('broken_clouds_51-84_percent');
			}
		});
		it('should get cache data with getWeatherById', async () => {
			expect(cache.get(`id:${currentId}:undefined:undefined`)).not.to.be.undefined;
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherById(currentId);
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
	});

	describe('getWeatherByCity', () => {
		it('should get data with getWeatherByCity', async () => {
			expect(cache.get('q:London:gb:undefined:undefined')).to.be.undefined;
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByCity('London', 'gb');
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
		it('should get cache data with getWeatherByCity', async () => {
			expect(cache.get('q:London:gb:undefined:undefined')).not.to.be.undefined;
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByCity('London', 'gb');
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
	});

	describe('getWeatherByLatLon', () => {
		it('should get data with getWeatherByLatLon', async () => {
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(51.5049899, -0.1223291);
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
		it('should get cache data with getWeatherByLatLon', async () => {
			const res: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(51.5049899, -0.1223291);
			expect(res.ok()).to.be.an('object');
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
	});
});
