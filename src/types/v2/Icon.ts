import {z} from 'zod';

export const dayIconList = ['01d', '02d', '03d', '04d', '09d', '10d', '11d', '13d', '50d'] as const;
export type DayIcon = (typeof dayIconList)[number];

/**
 * @internal
 */
export const dayIconListSchema: z.ZodEnum<Record<DayIcon, DayIcon>> = z.enum(dayIconList);

export const nightIconList = ['01n', '02n', '03n', '04n', '09n', '10n', '11n', '13n', '50n'] as const;
export type NightIcon = (typeof nightIconList)[number];

/**
 * @internal
 */
export const nightIconListSchema: z.ZodEnum<Record<NightIcon, NightIcon>> = z.enum(nightIconList);

/**
 * @internal
 */
export const iconSchema: z.ZodUnion<[typeof dayIconListSchema, typeof nightIconListSchema]> = z.union([dayIconListSchema, nightIconListSchema]);

export type Icon = z.infer<typeof iconSchema>;
