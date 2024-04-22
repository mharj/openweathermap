import {Option, undefinedOptionWrap} from '@luolapeikko/result-option';
import {z} from 'zod';

/**
 * This is a list of weather ids, groups and descriptions from OpenWeatherMap API
 */
export const weatherIdGroup = [
	{
		id: 200,
		group: 'thunderstorm',
		description: 'thunderstorm_with_light_rain',
	},
	{
		id: 201,
		group: 'thunderstorm',
		description: 'thunderstorm_with_rain',
	},
	{
		id: 202,
		group: 'thunderstorm',
		description: 'thunderstorm_with_heavy_rain',
	},
	{
		id: 210,
		group: 'thunderstorm',
		description: 'light_thunderstorm',
	},
	{
		id: 211,
		group: 'thunderstorm',
		description: 'thunderstorm',
	},
	{
		id: 212,
		group: 'thunderstorm',
		description: 'heavy_thunderstorm',
	},
	{
		id: 221,
		group: 'thunderstorm',
		description: 'ragged_thunderstorm',
	},
	{
		id: 230,
		group: 'thunderstorm',
		description: 'thunderstorm_with_light_drizzle',
	},
	{
		id: 231,
		group: 'thunderstorm',
		description: 'thunderstorm_with_drizzle',
	},
	{
		id: 232,
		group: 'thunderstorm',
		description: 'thunderstorm_with_heavy_drizzle',
	},
	{
		id: 300,
		group: 'drizzle',
		description: 'light_intensity_drizzle',
	},
	{
		id: 301,
		group: 'drizzle',
		description: 'drizzle',
	},
	{
		id: 302,
		group: 'drizzle',
		description: 'heavy_intensity_drizzle',
	},
	{
		id: 310,
		group: 'drizzle',
		description: 'light_intensity_drizzle_rain',
	},
	{
		id: 311,
		group: 'drizzle',
		description: 'drizzle_rain',
	},
	{
		id: 312,
		group: 'drizzle',
		description: 'heavy_intensity_drizzle_rain',
	},
	{
		id: 313,
		group: 'drizzle',
		description: 'shower_rain_and_drizzle',
	},
	{
		id: 314,
		group: 'drizzle',
		description: 'heavy_shower_rain_and_drizzle',
	},
	{
		id: 321,
		group: 'drizzle',
		description: 'shower_drizzle',
	},
	{
		id: 500,
		group: 'rain',
		description: 'light_rain',
	},
	{
		id: 501,
		group: 'rain',
		description: 'moderate_rain',
	},
	{
		id: 502,
		group: 'rain',
		description: 'heavy_intensity_rain',
	},
	{
		id: 503,
		group: 'rain',
		description: 'very_heavy_rain',
	},
	{
		id: 504,
		group: 'rain',
		description: 'extreme_rain',
	},
	{
		id: 511,
		group: 'rain',
		description: 'freezing_rain',
	},
	{
		id: 520,
		group: 'rain',
		description: 'light_intensity_shower_rain',
	},
	{
		id: 521,
		group: 'rain',
		description: 'shower_rain',
	},
	{
		id: 522,
		group: 'rain',
		description: 'heavy_intensity_shower_rain',
	},
	{
		id: 531,
		group: 'rain',
		description: 'ragged_shower_rain',
	},
	{
		id: 600,
		group: 'snow',
		description: 'light_snow',
	},
	{
		id: 601,
		group: 'snow',
		description: 'snow',
	},
	{
		id: 602,
		group: 'snow',
		description: 'heavy_snow',
	},
	{
		id: 611,
		group: 'snow',
		description: 'sleet',
	},
	{
		id: 612,
		group: 'snow',
		description: 'light_shower_sleet',
	},
	{
		id: 613,
		group: 'snow',
		description: 'shower_sleet',
	},
	{
		id: 615,
		group: 'snow',
		description: 'light_rain_and_snow',
	},
	{
		id: 616,
		group: 'snow',
		description: 'rain_and_snow',
	},
	{
		id: 620,
		group: 'snow',
		description: 'light_shower_snow',
	},
	{
		id: 621,
		group: 'snow',
		description: 'shower_snow',
	},
	{
		id: 622,
		group: 'snow',
		description: 'heavy_shower_snow',
	},
	{
		id: 701,
		group: 'atmosphere',
		description: 'mist',
	},
	{
		id: 711,
		group: 'atmosphere',
		description: 'smoke',
	},
	{
		id: 721,
		group: 'atmosphere',
		description: 'haze',
	},
	{
		id: 731,
		group: 'atmosphere',
		description: 'sand_dust_whirls',
	},
	{
		id: 741,
		group: 'atmosphere',
		description: 'fog',
	},
	{
		id: 751,
		group: 'atmosphere',
		description: 'sand',
	},
	{
		id: 761,
		group: 'atmosphere',
		description: 'dust',
	},
	{
		id: 762,
		group: 'atmosphere',
		description: 'volcanic_ash',
	},
	{
		id: 771,
		group: 'atmosphere',
		description: 'squalls',
	},
	{
		id: 781,
		group: 'atmosphere',
		description: 'tornado',
	},
	{
		id: 800,
		group: 'clear',
		description: 'clear_sky',
	},
	{
		id: 801,
		group: 'clouds',
		description: 'few_clouds_11-25_percent',
	},
	{
		id: 802,
		group: 'clouds',
		description: 'scattered_clouds_25-50_percent',
	},
	{
		id: 803,
		group: 'clouds',
		description: 'broken_clouds_51-84_percent',
	},
	{
		id: 804,
		group: 'clouds',
		description: 'overcast_clouds_85-100_percent',
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
export const weatherIdSchema = z.custom<WeatherID>((val) => {
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
export function getWeatherV2Description(id: WeatherID | undefined): Option<WeatherDescription> {
	return undefinedOptionWrap(weatherIdGroup.find((x) => x.id === id)?.description);
}
