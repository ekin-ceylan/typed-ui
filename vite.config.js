export default {
    base: '',
    root: './',
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        lib: {
            entry: 'src/index.js',
            name: 'TypedUI',
            fileName: format => `typed-ui.${format}.js`, // Format'ı dosya adına ekle
            formats: ['es', 'iife'],
        },
        rollupOptions: {
            external: [], // lit'i bundle içine dahil et (CDN için)
            output: {
                manualChunks: undefined,
                globals: {}, // IIFE için global değişken adı
            },
        },
        minify: 'terser', // veya 'esbuild' (daha hızlı)
        cssMinify: true, // CSS minification
        sourcemap: false, // Source maps (isteğe bağlı)
    },
};
