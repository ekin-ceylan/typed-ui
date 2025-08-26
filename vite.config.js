export default {
    base: '',
    root: './',
    build: {
        emptyOutDir: true,
        outDir: 'dist',
        minify: 'terser', // veya 'esbuild' (daha hızlı)
        rollupOptions: {
            output: {
                manualChunks: undefined,
            },
        },
        // CSS minification
        cssMinify: true,
        // Source maps (isteğe bağlı)
        sourcemap: false,
    },
};
