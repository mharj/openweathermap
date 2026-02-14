import {type IOption, None, Some} from '@luolapeikko/result-option';
import {z} from 'zod';

/**
 * This is a list of weather ids, groups and descriptions from OpenWeatherMap API
 */
export const weatherIdGroup = [
	{
		description: 'thunderstorm_with_light_rain',
		group: 'thunderstorm',
		id: 200,
	},
	{
		description: 'thunderstorm_with_rain',
		group: 'thunderstorm',
		id: 201,
	},
	{
		description: 'thunderstorm_with_heavy_rain',
		group: 'thunderstorm',
		id: 202,
	},
	{
		description: 'light_thunderstorm',
		group: 'thunderstorm',
		id: 210,
	},
	{
		description: 'thunderstorm',
		group: 'thunderstorm',
		id: 211,
	},
	{
		description: 'heavy_thunderstorm',
		group: 'thunderstorm',
		id: 212,
	},
	{
		description: 'ragged_thunderstorm',
		group: 'thunderstorm',
		id: 221,
	},
	{
		description: 'thunderstorm_with_light_drizzle',
		group: 'thunderstorm',
		id: 230,
	},
	{
		description: 'thunderstorm_with_drizzle',
		group: 'thunderstorm',
		id: 231,
	},
	{
		description: 'thunderstorm_with_heavy_drizzle',
		group: 'thunderstorm',
		id: 232,
	},
	{
		description: 'light_intensity_drizzle',
		group: 'drizzle',
		id: 300,
	},
	{
		description: 'drizzle',
		group: 'drizzle',
		id: 301,
	},
	{
		description: 'heavy_intensity_drizzle',
		group: 'drizzle',
		id: 302,
	},
	{
		description: 'light_intensity_drizzle_rain',
		group: 'drizzle',
		id: 310,
	},
	{
		description: 'drizzle_rain',
		group: 'drizzle',
		id: 311,
	},
	{
		description: 'heavy_intensity_drizzle_rain',
		group: 'drizzle',
		id: 312,
	},
	{
		description: 'shower_rain_and_drizzle',
		group: 'drizzle',
		id: 313,
	},
	{
		description: 'heavy_shower_rain_and_drizzle',
		group: 'drizzle',
		id: 314,
	},
	{
		description: 'shower_drizzle',
		group: 'drizzle',
		id: 321,
	},
	{
		description: 'light_rain',
		group: 'rain',
		id: 500,
	},
	{
		description: 'moderate_rain',
		group: 'rain',
		id: 501,
	},
	{
		description: 'heavy_intensity_rain',
		group: 'rain',
		id: 502,
	},
	{
		description: 'very_heavy_rain',
		group: 'rain',
		id: 503,
	},
	{
		description: 'extreme_rain',
		group: 'rain',
		id: 504,
	},
	{
		description: 'freezing_rain',
		group: 'rain',
		id: 511,
	},
	{
		description: 'light_intensity_shower_rain',
		group: 'rain',
		id: 520,
	},
	{
		description: 'shower_rain',
		group: 'rain',
		id: 521,
	},
	{
		description: 'heavy_intensity_shower_rain',
		group: 'rain',
		id: 522,
	},
	{
		description: 'ragged_shower_rain',
		group: 'rain',
		id: 531,
	},
	{
		description: 'light_snow',
		group: 'snow',
		id: 600,
	},
	{
		description: 'snow',
		group: 'snow',
		id: 601,
	},
	{
		description: 'heavy_snow',
		group: 'snow',
		id: 602,
	},
	{
		description: 'sleet',
		group: 'snow',
		id: 611,
	},
	{
		description: 'light_shower_sleet',
		group: 'snow',
		id: 612,
	},
	{
		description: 'shower_sleet',
		group: 'snow',
		id: 613,
	},
	{
		description: 'light_rain_and_snow',
		group: 'snow',
		id: 615,
	},
	{
		description: 'rain_and_snow',
		group: 'snow',
		id: 616,
	},
	{
		description: 'light_shower_snow',
		group: 'snow',
		id: 620,
	},
	{
		description: 'shower_snow',
		group: 'snow',
		id: 621,
	},
	{
		description: 'heavy_shower_snow',
		group: 'snow',
		id: 622,
	},
	{
		description: 'mist',
		group: 'atmosphere',
		id: 701,
	},
	{
		description: 'smoke',
		group: 'atmosphere',
		id: 711,
	},
	{
		description: 'haze',
		group: 'atmosphere',
		id: 721,
	},
	{
		description: 'sand_dust_whirls',
		group: 'atmosphere',
		id: 731,
	},
	{
		description: 'fog',
		group: 'atmosphere',
		id: 741,
	},
	{
		description: 'sand',
		group: 'atmosphere',
		id: 751,
	},
	{
		description: 'dust',
		group: 'atmosphere',
		id: 761,
	},
	{
		description: 'volcanic_ash',
		group: 'atmosphere',
		id: 762,
	},
	{
		description: 'squalls',
		group: 'atmosphere',
		id: 771,
	},
	{
		description: 'tornado',
		group: 'atmosphere',
		id: 781,
	},
	{
		description: 'clear_sky',
		group: 'clear',
		id: 800,
	},
	{
		description: 'few_clouds_11-25_percent',
		group: 'clouds',
		id: 801,
	},
	{
		description: 'scattered_clouds_25-50_percent',
		group: 'clouds',
		id: 802,
	},
	{
		description: 'broken_clouds_51-84_percent',
		group: 'clouds',
		id: 803,
	},
	{
		description: 'overcast_clouds_85-100_percent',
		group: 'clouds',
		id: 804,
	},
] as const;

export type WeatherID = (typeof weatherIdGroup)[number]['id'];

/**
 * WeatherGroup:  "clouds" | "rain" | "snow" | "thunderstorm" | "drizzle" | "atmosphere" | "clear"
 */
export type WeatherGroup = (typeof weatherIdGroup)[number]['group'];

/**
 * List for weather description key types from OpenWeatherMap API based on weather id.
 *
 * This list of keys can be used to translate weather id to human readable description with different languages.
 * @example
 * const i18Weather: Record<WeatherDescription, string> = {
 *  clear_sky: 'Clear sky',
 *  ...
 * }
 */
export type WeatherDescription = (typeof weatherIdGroup)[number]['description'];

/**
 * Weather id schema
 * @internal
 */
export const weatherIdSchema: z.ZodType<WeatherID> = z.custom<WeatherID>((val) => {
	if (typeof val !== 'number') {
		return {message: 'Expected a number', success: false};
	}
	if (!weatherIdGroup.find((x) => x.id === val)) {
		return {message: 'Expected a valid weather id', success: false};
	}
	return val;
});

/**
 * get weather description key from weather id
 * @param id - weather id
 * @returns {Option<WeatherDescription>}  option for weather description key
 * @example
 * const weatherComponent = ({data}) => {
 *   const key = getWeatherV2Description(data.weather[0]?.id).unwrapOr('unknown');
 *   return (
 *     <div>
 *       {t(`weather:${key}`}
 *     </div>
 *   );
 * }
 */
export function getWeatherV2Description(id: WeatherID | undefined): IOption<WeatherDescription> {
	const description = id ? weatherIdGroup.find((x) => x.id === id)?.description : undefined;
	return description ? Some(description) : None();
}
