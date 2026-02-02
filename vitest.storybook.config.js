import { defineConfig } from 'vitest/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
const dirname = typeof __dirname === 'undefined' ? path.dirname(fileURLToPath(import.meta.url)) : __dirname;

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
    test: {
        name: 'storybook',
        globals: true,
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
            headless: true,
            screenshotFailures: false,
        },
        setupFiles: ['.storybook/vitest.setup.ts'],
        plugins: [
            storybookTest({
                configDir: path.join(dirname, '.storybook'),
            }),
        ],
        include: ['**/*.stories.@(js|jsx|ts|tsx)'],
    },
});
