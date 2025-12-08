import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));
const VERSION = pkg.version;

const LICENSE = `/**
 * @license
 * Typed UI v${VERSION}
 * (c) 2025 Ekin Ceylan
 * License: MIT
 */
`;
export const terserOptions = {
    compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
    },
    mangle: true,
    format: {
        comments: false,
        preamble: LICENSE.trim(),
    },
};
