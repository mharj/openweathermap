/// <reference types="vitest" />

import {defineConfig} from 'vitest/config';

export default defineConfig({
	test: {
		coverage: {
			include: ['src/**/*.ts'],
			provider: 'v8',
			reporter: ['text'],
		},
		include: ['test/**/*.test.ts'],
		outputFile: {
			junit: './test-results.xml',
		},
		reporters: process.env.GITHUB_ACTIONS ? ['github-actions', 'junit'] : ['verbose', 'github-actions', 'junit'],
	},
});
