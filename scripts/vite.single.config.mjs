import { defineConfig } from 'vite';
import minifyHTMLPlugin from 'rollup-plugin-minify-html-literals';
import { terserOptions } from './constants.js';

const minifyHTML = minifyHTMLPlugin.default ?? minifyHTMLPlugin;

export function createConfig(projectRoot, entryAbsPath) {
    return defineConfig({
        configFile: false, // Kökteki vite.config.* dosyasını tamamen yok say
        base: '',
        root: projectRoot,
        build: {
            outDir: 'dist',
            emptyOutDir: false,
            terserOptions,
            rollupOptions: {
                input: entryAbsPath,
                output: {
                    dir: 'dist',
                    entryFileNames: `typed-ui.[name].min.js`,
                    format: 'es',
                },
                external: ['lit'],
                plugins: [minifyHTML()],
                treeshake: false,
            },
            minify: 'terser',
            sourcemap: true,
        },
    });
}
