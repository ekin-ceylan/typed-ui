import esbuild from 'esbuild';
import { globSync } from 'glob';
import { readFileSync } from 'node:fs';
import { minifyHTMLLiteralsPlugin } from 'esbuild-plugin-minify-html-literals';

// TODO: klasörü boşalt
// ---- package.json oku
const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

const bannerText = `/*!
 * @license
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()} ${pkg.author}
 * Released under the ${pkg.license} License
 */`;

const entryFiles = globSync('src/entries/**/*.js', { nodir: true });
const iifeEntry = 'src/entries/all.js';

const esmOptions = {
    entryPoints: entryFiles,

    outdir: 'dist',
    entryNames: '[dir]/typed-ui.[name]', // klasör yapısını korur

    bundle: true,
    splitting: false,
    treeShaking: true,
    format: 'esm',
    platform: 'browser',
    target: 'es2020',

    minify: true,
    legalComments: 'inline', // none | linked | inline | eof
    sourcemap: false,

    plugins: [minifyHTMLLiteralsPlugin()],
    external: ['lit', 'lit/*'],
    banner: {
        js: bannerText,
    },
};

const esmWithLit = {
    ...esmOptions,
    entryNames: '[dir]/typed-ui-with-lit.[name]', // klasör yapısını korur
    external: [],
};

const iifeOptions = {
    ...esmOptions,
    entryPoints: [iifeEntry],
    entryNames: 'typed-ui.iife',
    external: [],
    format: 'iife',
};

await esbuild.build(esmOptions);
await esbuild.build(esmWithLit);
await esbuild.build(iifeOptions);
