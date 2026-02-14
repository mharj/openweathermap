import {z} from 'zod';
import {iconSchema} from './Icon';
import {weatherIdSchema} from './weatherIdGroup';

export * from './Icon';
export * from './Language';
export * from './weatherIdGroup';

const coordSchema = z.object({
	lat: z.number(),
	lon: z.number(),
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
	deg: z.number(),
	speed: z.number(),
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
	id: z.number().optional(),
	message: z.number().optional(),
	sunrise: z.number(),
	sunset: z.number(),
	type: z.number().optional(),
});

export type WeatherDataV2 = z.infer<typeof weatherDataV2Schema>;

export const weatherDataV2Schema: z.ZodObject<
	{
		base: z.ZodString;
		clouds: z.ZodObject<
			{
				all: z.ZodNumber;
			},
			z.core.$strip
		>;
		cod: z.ZodNumber;
		coord: z.ZodObject<
			{
				lat: z.ZodNumber;
				lon: z.ZodNumber;
			},
			z.core.$strip
		>;
		dt: z.ZodNumber;
		id: z.ZodNumber;
		main: z.ZodObject<
			{
				grnd_level: z.ZodOptional<z.ZodNumber>;
				humidity: z.ZodNumber;
				pressure: z.ZodNumber;
				sea_level: z.ZodOptional<z.ZodNumber>;
				temp: z.ZodNumber;
				temp_max: z.ZodNumber;
				temp_min: z.ZodNumber;
			},
			z.core.$strip
		>;
		name: z.ZodString;
		rain: z.ZodOptional<
			z.ZodObject<
				{
					'1h': z.ZodOptional<z.ZodNumber>;
					'3h': z.ZodOptional<z.ZodNumber>;
				},
				z.core.$strip
			>
		>;
		snow: z.ZodOptional<
			z.ZodObject<
				{
					'1h': z.ZodOptional<z.ZodNumber>;
					'3h': z.ZodOptional<z.ZodNumber>;
				},
				z.core.$strip
			>
		>;
		sys: z.ZodObject<
			{
				country: z.ZodString;
				id: z.ZodOptional<z.ZodNumber>;
				message: z.ZodOptional<z.ZodNumber>;
				sunrise: z.ZodNumber;
				sunset: z.ZodNumber;
				type: z.ZodOptional<z.ZodNumber>;
			},
			z.core.$strip
		>;
		timezone: z.ZodNumber;
		visibility: z.ZodNumber;
		weather: z.ZodArray<
			z.ZodObject<
				{
					description: z.ZodString;
					icon: z.ZodUnion<
						[
							z.ZodEnum<
								Record<
									'01d' | '02d' | '03d' | '04d' | '09d' | '10d' | '11d' | '13d' | '50d',
									'01d' | '02d' | '03d' | '04d' | '09d' | '10d' | '11d' | '13d' | '50d'
								>
							>,
							z.ZodEnum<
								Record<
									'01n' | '02n' | '03n' | '04n' | '09n' | '10n' | '11n' | '13n' | '50n',
									'01n' | '02n' | '03n' | '04n' | '09n' | '10n' | '11n' | '13n' | '50n'
								>
							>,
						]
					>;
					id: z.ZodType<
						| 200
						| 201
						| 202
						| 210
						| 211
						| 212
						| 221
						| 230
						| 231
						| 232
						| 300
						| 301
						| 302
						| 310
						| 311
						| 312
						| 313
						| 314
						| 321
						| 500
						| 501
						| 502
						| 503
						| 504
						| 511
						| 520
						| 521
						| 522
						| 531
						| 600
						| 601
						| 602
						| 611
						| 612
						| 613
						| 615
						| 616
						| 620
						| 621
						| 622
						| 701
						| 711
						| 721
						| 731
						| 741
						| 751
						| 761
						| 762
						| 771
						| 781
						| 800
						| 801
						| 802
						| 803
						| 804,
						unknown,
						z.core.$ZodTypeInternals<
							| 200
							| 201
							| 202
							| 210
							| 211
							| 212
							| 221
							| 230
							| 231
							| 232
							| 300
							| 301
							| 302
							| 310
							| 311
							| 312
							| 313
							| 314
							| 321
							| 500
							| 501
							| 502
							| 503
							| 504
							| 511
							| 520
							| 521
							| 522
							| 531
							| 600
							| 601
							| 602
							| 611
							| 612
							| 613
							| 615
							| 616
							| 620
							| 621
							| 622
							| 701
							| 711
							| 721
							| 731
							| 741
							| 751
							| 761
							| 762
							| 771
							| 781
							| 800
							| 801
							| 802
							| 803
							| 804,
							unknown
						>
					>;
					main: z.ZodString;
				},
				z.core.$strip
			>
		>;
		wind: z.ZodObject<
			{
				deg: z.ZodNumber;
				speed: z.ZodNumber;
			},
			z.core.$strip
		>;
	},
	z.core.$strip
> = z.object({
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

export function isWeatherDataV2(data: unknown): data is WeatherDataV2 {
	return weatherDataV2Schema.safeParse(data).success;
}

export function assertWeatherDataV2(data: unknown): asserts data is WeatherDataV2 {
	weatherDataV2Schema.parse(data);
}
