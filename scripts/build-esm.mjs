import { build } from 'vite';
import { globSync } from 'glob';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createConfig } from './vite.single.config.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

async function run() {
    const files = globSync('src/entries/*.js', { cwd: projectRoot, absolute: true });

    for (const file of files) {
        await build(createConfig(projectRoot, file));
    }
}

try {
    await run();
} catch (err) {
    console.error(err);
    process.exit(1);
}
