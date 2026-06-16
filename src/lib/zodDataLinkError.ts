import {ZodError} from 'zod';

/**
 * Logs a Zod data validation error to the console and provides a link to create a GitHub issue.
 * @param err The error to log.
 * @param query The query parameters used to fetch the data.
 * @param rawData The raw data that was fetched.
 */
export function zodDataLinkError(err: unknown, query: string, rawData: unknown): void {
	if (err instanceof ZodError && rawData instanceof Object) {
		const prettyJson = JSON.stringify(rawData);
		const body = `## params:\n\`${query}\`\n## body:\n\`\`\`json\n${prettyJson}\n\`\`\`\n## error:\n\`\`\`json\n${err.message}\n\`\`\``;
		const params = new URLSearchParams();
		params.append('title', 'Zod data validation issue');
		params.append('body', body);
		const link = `https://github.com/mharj/openweathermap/issues/new?${params.toString()}`;
		console.error('Zod data validation error: please click to report data validation issue', link);
	}
}
