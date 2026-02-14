import {Err, Ok} from '@luolapeikko/result-option';
import {readFile} from 'fs/promises';
import type {IOpenWeatherV2} from '../../src/interfaces/IOpenWeatherV2';
import {assertWeatherDataV2, type WeatherDataV2} from '../../src/types/v2';

export const unitTestData = {
	base: 'stations',
	clouds: {all: 75},
	cod: 200,
	coord: {lat: 51.5085, lon: -0.1257},
	dt: 1690176942,
	id: 2643743,
	main: {
		feels_like: 288.57,
		humidity: 90,
		pressure: 1002,
		temp: 288.62,
		temp_max: 289.34,
		temp_min: 287.2,
	},
	name: 'London',
	sys: {
		country: 'GB',
		id: 2075535,
		sunrise: 1690171914,
		sunset: 1690228906,
		type: 2,
	},
	timezone: 3600,
	visibility: 10000,
	weather: [
		{
			description: 'broken clouds',
			icon: '04d',
			id: 803,
			main: 'Clouds',
		},
	],
	wind: {deg: 250, speed: 3.09},
} as const;

export const unitTestApiV2: IOpenWeatherV2 = {
	dataWeatherApi: async (params: URLSearchParams) => {
		const id = params.get('id');
		if (!id) {
			assertWeatherDataV2(unitTestData);
			return Ok<WeatherDataV2, SyntaxError | TypeError>(unitTestData);
		}
		try {
			const data: unknown = JSON.parse((await readFile(`./test/lib/data/${id}.json`, {encoding: 'utf-8'})).toString());
			assertWeatherDataV2(data);
			return Ok<WeatherDataV2, SyntaxError | TypeError>(data);
		} catch (err) {
			return Err(err instanceof SyntaxError ? err : new SyntaxError('unknown error'));
		}
	},
};
