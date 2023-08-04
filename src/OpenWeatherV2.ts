import {assertWeatherDataV2, CountryCode, LangCode, Loadable, WeatherDataV2} from './types';
import {Err, Ok, Result, safeAsyncResult, safeAsyncResultBuilder} from 'mharj-result';
import {fetchErrorWrapper} from './lib/fetchUtils';
import type {ICacheOrAsync} from '@avanio/expire-cache';
import type {IOpenWeatherV2} from './interfaces/IOpenWeatherV2';

const fetchResult = safeAsyncResultBuilder<Parameters<typeof fetch>, Response, SyntaxError | TypeError>(fetch);

/**
 * Open Weather V2 API Common Options
 * @default {lang: 'en', units: 'standard'} in API
 * @example
 * {lang: 'fi', units: 'metric'}
 */
export type OpenWeatherV2CommonOptions = {
	/**
	 * Language code
	 */
	lang?: LangCode;
	/**
	 * Weather units
	 */
	units?: 'standard' | 'metric' | 'imperial';
};

const defaultImplementation: IOpenWeatherV2 = {
	dataWeatherApi: async (params: URLSearchParams): Promise<Result<WeatherDataV2, SyntaxError | TypeError>> => {
		const result = await fetchResult(`https://api.openweathermap.org/data/2.5/weather?${params.toString()}`);
		if (!result.isOk) {
			return Err(result.err());
		}
		const res = result.ok();
		if (!res.ok) {
			return Err(new TypeError(`OpenWeatherV2 http error: ${res.status} ${res.statusText}`));
		}
		const data = await safeAsyncResult<unknown, SyntaxError>(res.json());
		assertWeatherDataV2(data);
		return Ok<WeatherDataV2, SyntaxError | TypeError>(data);
	},
};

/**
 * Open Weather V2 API
 * @example
 * const weather = new OpenWeatherV2('your-api-key');
 *
 * const cache = new ExpireCache<WeatherDataV2>(undefined, undefined, 900000); // data 15 minutes in cache
 * const weather = new OpenWeatherV2(() => Promise.resolve('your-api-key'), cache);
 *
 * const data: WeatherDataV2 = (await weather.getWeatherById(2643743)).unwrap(); // throws if error
 * const data: WeatherDataV2 | undefined = (await weather.getWeatherByCity('Helsinki', 'fi')).ok();
 *
 * const result: Result<WeatherDataV2> = await weather.getWeatherByLatLon(60.1699, 24.9384);
 * result.match({
 *  Ok: (data: WeatherDataV2) => console.log(data),
 *  Err: (err: DOMException | TypeError) => console.error(err),
 * });
 *
 * if(result.isOk) {
 *   const data: WeatherDataV2 = data.ok();
 * } else {
 *   const err: DOMException | TypeError = data.err();
 * }
 */
export class OpenWeatherV2 {
	private cache: ICacheOrAsync<WeatherDataV2> | undefined;
	private loadableApiKey: Loadable<string>;
	private apiHandler: IOpenWeatherV2;
	/**
	 * OpenWeatherV2 constructor
	 * @param {Loadable<string>} loadableApiKey - Loadable API key
	 * @param {ICacheOrAsync<WeatherDataV2>=} cache - optional async cache implementation
	 * @param {IOpenWeatherV2=} apiHandler - optional API handler implementation for mocking
	 */
	constructor(loadableApiKey: Loadable<string>, cache?: ICacheOrAsync<WeatherDataV2>, apiHandler: IOpenWeatherV2 = defaultImplementation) {
		this.loadableApiKey = loadableApiKey;
		this.cache = cache;
		this.apiHandler = apiHandler;
	}

	/**
	 * get weather by Id
	 * @param {number} id       - Weather station ID
	 * @param {OpenWeatherV2CommonOptions=} opts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
	 * @return {Promise<Result<WeatherDataV2, DOMException | TypeError>>} Weather data Result Promise
	 * @example
	 * const result: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherResultById(id: 564, {lang: 'fi'});
	 * if (result.isOk) {
	 *   const weatherData: WeatherDataV2 = result.ok();
	 * } else {
	 *   const error: DOMException | TypeError = result.err();
	 * }
	 */
	public async getWeatherById(id: number, opts: OpenWeatherV2CommonOptions = {}): Promise<Result<WeatherDataV2, DOMException | TypeError>> {
		try {
			const cacheKey = this.buildBaseCacheKey(`id:${id}`, opts);
			let cacheEntry = this.cache && (await this.cache.get(cacheKey));
			if (!cacheEntry) {
				const params = await this.buildBaseParams(opts);
				params.append('id', String(id));
				cacheEntry = await this.handleFetch(cacheKey, params, opts);
			}
			return Ok(cacheEntry);
		} catch (err) {
			return Err(fetchErrorWrapper(err));
		}
	}

	/**
	 * get weather with city name and optional country code
	 * @param {string} city       - City name
	 * @param {countryCode=} countryCode       - Optional Country code
	 * @param {OpenWeatherV2CommonOptions=} opts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
	 * @return {Promise<Result<WeatherDataV2, DOMException | TypeError>>} Weather data Result Promise
	 * @example
	 * const result: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByCity('Helsinki', 'fi', {lang: 'fi'});
	 * if (result.isOk) {
	 *   const weatherData: WeatherDataV2 = result.ok();
	 * } else {
	 *   const error: DOMException | TypeError = result.err();
	 * }
	 */
	public async getWeatherByCity(
		city: string,
		countryCode?: CountryCode,
		opts: OpenWeatherV2CommonOptions = {},
	): Promise<Result<WeatherDataV2, DOMException | TypeError>> {
		try {
			const cacheKey = this.buildBaseCacheKey(`q:${city}:${countryCode}`, opts);
			let cacheEntry = this.cache && (await this.cache.get(cacheKey));
			if (!cacheEntry) {
				const params = await this.buildBaseParams(opts);
				params.append('q', countryCode ? `${city},${countryCode}` : city);
				cacheEntry = await this.handleFetch(cacheKey, params, opts);
			}
			return Ok(cacheEntry);
		} catch (err) {
			return Err(fetchErrorWrapper(err));
		}
	}

	/**
	 * get weather with latitude and longitude with Result
	 * @param {number} lat       - Latitude
	 * @param {number} lon       - Longitude
	 * @param {OpenWeatherV2CommonOptions=} opts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
	 * @return {Promise<Result<WeatherDataV2, DOMException | TypeError>>} Weather data Result Promise
	 * @example
	 * const result: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(60.1699, 24.9384, {lang: 'fi'});
	 * if (result.isOk) {
	 *   const weatherData: WeatherDataV2 = result.ok();
	 * } else {
	 *   const error: DOMException | TypeError = result.err();
	 * }
	 */
	public async getWeatherByLatLon(lat: number, lon: number, opts: OpenWeatherV2CommonOptions = {}): Promise<Result<WeatherDataV2, DOMException | TypeError>> {
		try {
			const cacheKey = this.buildBaseCacheKey(`latlon:${lat}:${lon}`, opts);
			let cacheEntry = this.cache && (await this.cache.get(cacheKey));
			if (!cacheEntry) {
				const params = await this.buildBaseParams(opts);
				params.append('lat', String(lat));
				params.append('lon', String(lon));
				cacheEntry = await this.handleFetch(cacheKey, params, opts);
			}
			return Ok(cacheEntry);
		} catch (err) {
			return Err(fetchErrorWrapper(err));
		}
	}

	private async buildBaseParams({lang, units}: OpenWeatherV2CommonOptions): Promise<URLSearchParams> {
		const apiKey = await (typeof this.loadableApiKey === 'function' ? this.loadableApiKey() : this.loadableApiKey);
		const params = new URLSearchParams();
		lang && params.append('lang', lang);
		units && params.append('units', units);
		params.append('appid', apiKey);
		return params;
	}

	/**
	 * build base cache key
	 * @param main - main cache key prefix
	 * @param opts -  OpenWeatherV2CommonOptions
	 * @returns {CacheKey}
	 */
	private buildBaseCacheKey(main: string, {lang, units}: OpenWeatherV2CommonOptions): string {
		return `${main}:${lang}:${units}`;
	}

	private async handleFetch(cacheKey: string, params: URLSearchParams, opts: OpenWeatherV2CommonOptions): Promise<WeatherDataV2> {
		const dataApiResult = await this.apiHandler.dataWeatherApi(params);
		const data: WeatherDataV2 = dataApiResult.unwrap();
		assertWeatherDataV2(data);
		if (this.cache) {
			await this.cache.set(cacheKey, data);
			if (!cacheKey.startsWith('id:')) {
				// update id cache too
				await this.cache.set(this.buildBaseCacheKey(`id:${data.id}`, opts), data);
			}
		}
		return data;
	}
}
