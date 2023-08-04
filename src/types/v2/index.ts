import {iconSchema} from './Icon';
import {weatherIdSchema} from './weatherIdGroup';
import {z} from 'zod';
export * from './Icon';
export * from './Language';
export * from './weatherIdGroup';

const coordSchema = z.object({
	lon: z.number(),
	lat: z.number(),
});

const weatherSchema = z.object({
	description: z.string(),
	icon: iconSchema,
	id: weatherIdSchema,
	main: z.string(),
});

const mainSchema = z.object({
	grnd_level: z.number().optional(),
	humidity: z.number(),
	pressure: z.number(),
	sea_level: z.number().optional(),
	temp: z.number(),
	temp_max: z.number(),
	temp_min: z.number(),
});

const windSchema = z.object({
	speed: z.number(),
	deg: z.number(),
});

const rainSchema = z.object({
	'1h': z.number().optional(),
	'3h': z.number().optional(),
});

const snowSchema = z.object({
	'1h': z.number().optional(),
	'3h': z.number().optional(),
});

const sysSchema = z.object({
	country: z.string(),
	id: z.number(),
	message: z.number().optional(),
	sunrise: z.number(),
	sunset: z.number(),
	type: z.number(),
});

/**
 * @internal
 */
export const weatherDataV2Schema = z.object({
	base: z.string(),
	clouds: z.object({
		all: z.number(),
	}),
	cod: z.number(),
	coord: coordSchema,
	dt: z.number(),
	id: z.number(),
	main: mainSchema,
	name: z.string(),
	rain: rainSchema.optional(),
	snow: snowSchema.optional(),
	sys: sysSchema,
	timezone: z.number(),
	visibility: z.number(),
	weather: z.array(weatherSchema),
	wind: windSchema,
});

export type WeatherDataV2 = z.infer<typeof weatherDataV2Schema>;

export function isWeatherDataV2(data: unknown): data is WeatherDataV2 {
	return weatherDataV2Schema.safeParse(data).success;
}

export function assertWeatherDataV2(data: unknown): asserts data is WeatherDataV2 {
	weatherDataV2Schema.parse(data);
}
