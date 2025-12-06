import { readFile, writeFile } from 'node:fs/promises';
import { minify } from 'terser';

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

run().catch(err => {
    console.error('Minify failed:', err);
    process.exit(1);
});
