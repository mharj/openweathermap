import {Result} from '@luolapeikko/result-option';
import {WeatherDataV2} from '../types/v2';

/**
 * Interface for OpenWeatherMap API v2 implementation.
 */
export interface IOpenWeatherV2 {
	dataWeatherApi: (params: URLSearchParams) => Promise<Result<WeatherDataV2, SyntaxError | TypeError>>;
}
