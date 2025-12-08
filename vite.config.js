import minifyHTMLPlugin from 'rollup-plugin-minify-html-literals';
import { terserOptions } from './scripts/constants.js';

const minifyHTML = minifyHTMLPlugin.default ?? minifyHTMLPlugin;

export default {
    configFile: false,
    base: '',
    root: './',
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        terserOptions: terserOptions,
        lib: {
            entry: 'src/entries/all.js',
            name: 'TypedUI',
            formats: ['iife'],
            fileName: _ => 'typed-ui.iife.min.js',
        },
        rollupOptions: {
            plugins: [minifyHTML()],
        },
        minify: 'terser',
        cssMinify: true, // CSS minification
        sourcemap: true, // Source maps (isteğe bağlı)
    },
};
