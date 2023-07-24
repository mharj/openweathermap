import {z} from 'zod';
const dayIconList = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'] as const;

/**
 * @internal
 */
const dayIconListSchema = z.enum(dayIconList);

export type DayIcon = z.infer<typeof dayIconListSchema>;

const nightIconList = ['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'] as const;

/**
 * @internal
 */
const nightIconListSchema = z.enum(nightIconList);
export type NightIcon = z.infer<typeof nightIconListSchema>;

/**
 * @internal
 */
export const iconSchema = z.union([dayIconListSchema, nightIconListSchema]);

export type Icon = z.infer<typeof iconSchema>;
