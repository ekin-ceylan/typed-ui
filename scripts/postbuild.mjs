import { readFile, writeFile } from 'node:fs/promises';
import { minify } from 'terser';
import fs from 'node:fs';

const dist = 'dist';
const terserOptions = {
    compress: {
        passes: 3,
        drop_console: true,
        drop_debugger: true,
    },
    mangle: true,
    format: {
        comments: false,
    },
};
const LICENSE = `/**
 * @license
 * Typed UI v0.3.0
 * (c) 2025 Ekin Ceylan
 * License: MIT
 */
`;

function prependLicense(filePath) {
    const code = fs.readFileSync(filePath, 'utf8');

    // Aynı dosyaya iki kere eklememek için
    if (code.startsWith('/**') && code.includes('@license')) {
        return;
    }

    fs.writeFileSync(filePath, LICENSE + code, 'utf8');
}

async function minifyFile(input, output) {
    const code = await readFile(input, 'utf8');

    const result = await minify(code, {
        ...terserOptions,
        sourceMap: {
            filename: output, // bundle içindeki isim
            url: output.split('/').pop() + '.map', // "typed-ui.es.min.js.map" gibi
        },
    });

    await writeFile(output, result.code, 'utf8');
    if (result.map) {
        await writeFile(output + '.map', result.map, 'utf8');
    }
}

async function run() {
    // ES normal → ES min
    await minifyFile(`${dist}/typed-ui.es.js`, `${dist}/typed-ui.es.min.js`);

    // IIFE normal → IIFE min
    await minifyFile(`${dist}/typed-ui.iife.js`, `${dist}/typed-ui.iife.min.js`);

    // Eğer IIFE’nin non-min halini istemezsen, burada silebilirsin:
    // import { unlink } from 'node:fs/promises';
    // await unlink(`${dist}/typed-ui.iife.js`);
}

try {
    await run();
    const targets = ['typed-ui.iife.js', 'typed-ui.iife.min.js', 'typed-ui.es.js', 'typed-ui.es.min.js'];

    for (const target of targets) {
        prependLicense(`${dist}/${target}`);
    }
} catch (err) {
    console.error('Minify failed:', err);
    process.exit(1);
}
