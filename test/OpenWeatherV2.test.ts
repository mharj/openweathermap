import {beforeEach, describe, expect, it} from 'vitest';
import {isWeatherDataV2, OpenWeatherV2, type WeatherDataV2, weatherDataV2Schema} from '../src/';
import {unitTestApiV2, unitTestData} from './lib/unitTestApi';
import {ExpireCache} from '@avanio/expire-cache';
import {type IResult} from '@luolapeikko/result-option';

let weather: OpenWeatherV2;
const cache = new ExpireCache<WeatherDataV2>(undefined, undefined, 900000); // 15 minutes in cache

const idList = new Set([3553478, 2643743]);

const defaultKeySuffix = 'en:standard';

/**
 * Update test data from OpenWeatherMap with PowerShell calls:
 * $apiKeyValue = '***'
 * $cityId = 3553478
 * $cityId = 2643743
 * Invoke-RestMethod -Uri "https://api.openweathermap.org/data/2.5/weather?id=$cityId&appid=$apiKeyValue" | ConvertTo-Json | Set-Content -Path "test/lib/data/$cityId.json"
 */

describe('OpenWeatherV2', () => {
	beforeEach(() => {
		weather = new OpenWeatherV2('not needed on testing', cache, unitTestApiV2); // 15 minutes in cache
	});
	idList.forEach((id) => {
		describe(`getWeatherById ${id}`, () => {
			it('should get data with getWeatherById', async () => {
				expect(cache.get(`id:${id}:${defaultKeySuffix}`)).to.be.eq(undefined);
				const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherById(id);
				res.unwrap(); // throw if error
				expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
				expect(isWeatherDataV2(res.ok())).to.be.eq(true);
			});
			it(`should get cache data with getWeatherById ${id}`, async () => {
				expect(cache.get(`id:${id}:${defaultKeySuffix}`)).not.to.eq(undefined);
				const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherById(id);
				res.unwrap(); // throw if error
				expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
				expect(isWeatherDataV2(res.ok())).to.be.eq(true);
			});
		});
	});

	describe('getWeatherByCity', () => {
		it('should get data with getWeatherByCity', async () => {
			expect(cache.get(`q:${unitTestData.name}:gb:${defaultKeySuffix}`)).to.be.eq(undefined);
			const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByCity(unitTestData.name, 'gb');
			expect(res.ok()).to.be.eql(unitTestData);
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
		it('should get cache data with getWeatherByCity', async () => {
			expect(cache.get(`q:${unitTestData.name}:gb:${defaultKeySuffix}`)).not.to.be.eq(undefined);
			const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByCity(unitTestData.name, 'gb');
			expect(res.ok()).to.be.eql(unitTestData);
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
	});

	describe('getWeatherByLatLon', () => {
		it('should get data with getWeatherByLatLon', async () => {
			const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(unitTestData.coord.lat, unitTestData.coord.lon);
			expect(res.ok()).to.be.eql(unitTestData);
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
		it('should get cache data with getWeatherByLatLon', async () => {
			const res: IResult<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(unitTestData.coord.lat, unitTestData.coord.lon);
			expect(res.ok()).to.be.eql(unitTestData);
			expect(() => weatherDataV2Schema.parse(res.ok())).to.not.throw();
		});
	});
});
