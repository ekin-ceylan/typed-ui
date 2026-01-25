import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['src/tests/setup.js'],
        include: ['src/tests/**/*.test.js'],
        exclude: ['src/tests/unit-tests/**/*.test.js'],
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
                {
                    browser: 'chromium',
                },
            ],
            headless: true,
            screenshotFailures: false,
        },
        coverage: {
            reporter: ['html', 'lcov'],
            include: ['src/**/*.{js,ts}'],
            exclude: ['src/tests/**', '**/*.d.ts', 'src/*.js'],
        },
        projects: [
            {
                extends: true,
                plugins: [
                    // The plugin will run tests for the stories defined in your Storybook config
                    // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
                    storybookTest({
                        configDir: path.join(dirname, '.storybook'),
                    }),
                ],
                test: {
                    name: 'storybook',
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: 'playwright',
                        instances: [
                            {
                                browser: 'chromium',
                            },
                        ],
                    },
                    setupFiles: ['.storybook/vitest.setup.ts'],
                },
            },
        ],
    },
});
