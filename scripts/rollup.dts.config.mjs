import fs from 'node:fs';
import path from 'node:path';
import dts from 'rollup-plugin-dts';

const entriesDir = 'types-tmp/entries';
const outDir = 'dist';

/**
 * entries klasöründeki .d.ts dosyalarını oku
 */
const entryFiles = fs.readdirSync(entriesDir).filter(file => file.endsWith('.d.ts'));

export default entryFiles.map(file => {
    const name = path.basename(file, '.d.ts');

    return {
        input: path.join(entriesDir, file),
        output: {
            file: path.join(outDir, `typed-ui.${name}.d.ts`),
            format: 'es',
        },
        plugins: [dts()],
    };
});
