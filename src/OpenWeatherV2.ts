import type {IAsyncCache} from '@luolapeikko/cache-types';
import {Err, type IResult, Ok, Result} from '@luolapeikko/result-option';
import type {Loadable} from '@luolapeikko/ts-common';
import type {IOpenWeatherV2} from './interfaces/IOpenWeatherV2';
import {fetchErrorWrapper} from './lib/fetchUtils';
import {assertWeatherDataV2, type CountryCode, type LangCode, type WeatherDataV2} from './types';

const fetchResult = Result.wrapAsyncFn<SyntaxError | TypeError, typeof fetch>(fetch);

function toParams(data: Record<string, string | number | boolean>): Record<string, string> {
	return Object.entries(data).reduce<Record<string, string>>((acc, [key, value]) => {
		acc[key] = String(value);
		return acc;
	}, {});
}

function isJson(response: Response): boolean {
	const contentType = response.headers.get('content-type');
	return contentType?.startsWith('application/json') ?? false;
}

function isOpenWeatherError(data: unknown): data is {cod: string; message: string} {
	return typeof data === 'object' && data !== null && 'cod' in data && 'message' in data;
}

/**
 * Open Weather V2 API Common Options
 * @default {lang: 'en', units: 'standard'} in API
 * @example
 * {lang: 'fi', units: 'metric'}
 * @since v0.0.1
 */
export type OpenWeatherV2CommonOptions = {
	/**
	 * Language code
	 */
	lang: LangCode;
	/**
	 * Weather units
	 */
	units: 'standard' | 'metric' | 'imperial';
};

const defaultCommonOptions = {
	lang: 'en',
	units: 'standard',
} satisfies OpenWeatherV2CommonOptions;

function buildOpts(opts: Partial<OpenWeatherV2CommonOptions>): OpenWeatherV2CommonOptions {
	return Object.assign({}, defaultCommonOptions, opts);
}

const basePath = 'https://api.openweathermap.org/data/2.5/weather';

function buildUrl(params: URLSearchParams): string {
	return `${basePath}?${params.toString()}`;
}

function buildLogUrl(params: URLSearchParams): string {
	const logParams = new URLSearchParams(params);
	logParams.set('appid', '***');
	return buildUrl(logParams);
}

const defaultImplementation: IOpenWeatherV2 = {
	dataWeatherApi: async (params: URLSearchParams): Promise<IResult<WeatherDataV2, SyntaxError | TypeError>> => {
		const logUrl = buildLogUrl(params);
		const result = await fetchResult(buildUrl(params));
		if (!result.isOk) {
			return Err(result.err());
		}
		const res = result.ok();
		if (!res.ok) {
			if (isJson(res)) {
				const data: unknown = await res.json();
				if (isOpenWeatherError(data)) {
					return Err(new TypeError(`OpenWeatherV2 error: ${data.message} from ${logUrl}`));
				}
			}
			return Err(new TypeError(`OpenWeatherV2 http error: ${res.status} ${res.statusText} from ${logUrl}`));
		}
		if (!isJson(res)) {
			return Err(new TypeError(`OpenWeatherV2 response is not json payload from ${logUrl}`));
		}
		const jsonResult = await Result.safeAsyncCall<unknown, SyntaxError>(() => res.json());
		if (!jsonResult.isOk) {
			return Err(jsonResult.err());
		}
		const data = jsonResult.ok();
		assertWeatherDataV2(data);
		return Ok<WeatherDataV2, SyntaxError | TypeError>(data);
	},
};

/**
 * Cache key types
 * @since v0.1.0
 */
type CacheKey = `q:${string}:${string}` | `id:${number}` | `latlon:${number}:${number}`;

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
 * @since v0.0.1
 */
export class OpenWeatherV2 {
	private cache: IAsyncCache<WeatherDataV2> | undefined;
	private loadableApiKey: Loadable<string>;
	private apiHandler: IOpenWeatherV2;
	private fetchPromiseMap = new Map<string, Promise<IResult<WeatherDataV2, DOMException | TypeError>>>();
	/**
	 * OpenWeatherV2 constructor
	 * @param {Loadable<string>} loadableApiKey - Loadable API key
	 * @param {ICacheOrAsync<WeatherDataV2>=} cache - optional async cache implementation
	 * @param {IOpenWeatherV2=} apiHandler - optional API handler implementation for mocking
	 */
	public constructor(loadableApiKey: Loadable<string>, cache?: IAsyncCache<WeatherDataV2>, apiHandler: IOpenWeatherV2 = defaultImplementation) {
		this.loadableApiKey = loadableApiKey;
		this.cache = cache;
		this.apiHandler = apiHandler;
	}

	/**
	 * get weather by Id
	 * @param {number} id       - Weather station ID
	 * @param {OpenWeatherV2CommonOptions=} currentOpts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
	 * @return {Promise<Result<WeatherDataV2, DOMException | TypeError>>} Weather data Result Promise
	 * @example
	 * const result: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherResultById(id: 564, {lang: 'fi'});
	 * if (result.isOk) {
	 *   const weatherData: WeatherDataV2 = result.ok();
	 * } else {
	 *   const error: DOMException | TypeError = result.err();
	 * }
	 */
	public async getWeatherById(id: number, currentOpts: Partial<OpenWeatherV2CommonOptions> = {}): Promise<IResult<WeatherDataV2, DOMException | TypeError>> {
		try {
			const opts = buildOpts(currentOpts);
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
	 * @param {OpenWeatherV2CommonOptions=} currentOpts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
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
		currentOpts: Partial<OpenWeatherV2CommonOptions> = {},
	): Promise<IResult<WeatherDataV2, DOMException | TypeError>> {
		try {
			const opts = buildOpts(currentOpts);
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
	 * @param {OpenWeatherV2CommonOptions=} currentOpts - Common options, example ```{lang: 'fi', units: 'metric'}```, defaults ```{lang: 'en', units: 'standard'}```
	 * @return {Promise<Result<WeatherDataV2, DOMException | TypeError>>} Weather data Result Promise
	 * @example
	 * const result: Result<WeatherDataV2, DOMException | TypeError> = await weather.getWeatherByLatLon(60.1699, 24.9384, {lang: 'fi'});
	 * if (result.isOk) {
	 *   const weatherData: WeatherDataV2 = result.ok();
	 * } else {
	 *   const error: DOMException | TypeError = result.err();
	 * }
	 */
	public async getWeatherByLatLon(
		lat: number,
		lon: number,
		currentOpts: Partial<OpenWeatherV2CommonOptions> = {},
	): Promise<IResult<WeatherDataV2, DOMException | TypeError>> {
		try {
			const opts = buildOpts(currentOpts);
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

	private async buildBaseParams(options: OpenWeatherV2CommonOptions): Promise<URLSearchParams> {
		const apiKey = await (typeof this.loadableApiKey === 'function' ? this.loadableApiKey() : this.loadableApiKey);
		const params = new URLSearchParams(toParams(options));
		params.append('appid', apiKey);
		return params;
	}

	/**
	 * build base cache key
	 * @param main - main cache key prefix
	 * @param opts -  OpenWeatherV2CommonOptions
	 * @returns {string} cache key
	 */
	private buildBaseCacheKey(main: CacheKey, {lang, units}: OpenWeatherV2CommonOptions): `${CacheKey}:${LangCode}:${'standard' | 'metric' | 'imperial'}` {
		return `${main}:${lang}:${units}`;
	}

	private async handleFetch(cacheKey: string, params: URLSearchParams, opts: OpenWeatherV2CommonOptions): Promise<WeatherDataV2> {
		// allow only one fetch per cacheKey until it is resolved
		let promiseResult = this.fetchPromiseMap.get(cacheKey);
		if (!promiseResult) {
			promiseResult = this.apiHandler.dataWeatherApi(params);
			this.fetchPromiseMap.set(cacheKey, promiseResult);
			await promiseResult;
			this.fetchPromiseMap.delete(cacheKey); // clear promise from map
		}
		const dataApiResult = await promiseResult;
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
