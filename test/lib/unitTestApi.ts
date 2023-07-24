/* eslint-disable sort-keys */
import {assertWeatherDataV2} from '../../src/types/v2';
import {IOpenWeatherV2} from '../../src/interfaces/IOpenWeatherV2';

const data = {
	coord: {lon: -0.1257, lat: 51.5085},
	weather: [
		{
			id: 803,
			main: 'Clouds',
			description: 'broken clouds',
			icon: '04d',
		},
	],
	base: 'stations',
	main: {
		temp: 288.62,
		feels_like: 288.57,
		temp_min: 287.2,
		temp_max: 289.34,
		pressure: 1002,
		humidity: 90,
	},
	visibility: 10000,
	wind: {speed: 3.09, deg: 250},
	clouds: {all: 75},
	dt: 1690176942,
	sys: {
		type: 2,
		id: 2075535,
		country: 'GB',
		sunrise: 1690171914,
		sunset: 1690228906,
	},
	timezone: 3600,
	id: 2643743,
	name: 'London',
	cod: 200,
};

export const unitTestApiV2: IOpenWeatherV2 = {
	dataWeatherApi: async () => {
		assertWeatherDataV2(data);
		return Promise.resolve(data);
	},
};
