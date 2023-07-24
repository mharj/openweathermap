export * from './v2';
export * from './ISO3166-Countries';

/**
 * Generic argument which can be value, Promise of value, function which returns value or Promise of value.
 * @example
 * function solveLoadable(value: Loadable<string>): string | Promise<string> {
 *   return typeof value === 'function' ? value() : value;
 * }
 */
export type Loadable<T> = T | Promise<T> | (() => T) | (() => Promise<T>);

export function solveLoadable(value: Loadable<string>): string | Promise<string> {
	return typeof value === 'function' ? value() : value;
}
