import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        setupFiles: ['src/tests/setup.js'],
        include: ['src/tests/**/*.test.js'],
        exclude: ['src/tests/unit-tests/**/*.test.js'],
        browser: {
            enabled: true,
            provider: 'playwright',
            instances: [{ browser: 'chromium' }],
            headless: true,
            screenshotFailures: false,
        },
        coverage: {
            reporter: ['html', 'lcov'],
            include: ['src/**/*.{js,ts}'],
            exclude: ['src/tests/**', '**/*.d.ts', 'src/*.js'],
        },
    },
});
