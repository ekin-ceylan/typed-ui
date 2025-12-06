import minifyHTMLPlugin from 'rollup-plugin-minify-html-literals';

const minifyHTML = minifyHTMLPlugin.default ?? minifyHTMLPlugin;

export default {
    base: '',
    root: './',
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        lib: {
            entry: 'src/index.js',
            name: 'TypedUI',
            formats: ['es', 'iife'],
            fileName: format => `typed-ui.${format}.js`, // Format'ı dosya adına ekle
        },
        rollupOptions: {
            external: [], // lit'i bundle içine dahil et (CDN için)
            output: {
                manualChunks: undefined,
                globals: {}, // IIFE için global değişken adı
            },
            plugins: [minifyHTML()],
        },
        minify: false, // veya 'esbuild' (daha hızlı)
        cssMinify: true, // CSS minification
        sourcemap: false, // Source maps (isteğe bağlı)
    },
};
