import path from 'node:path';
import dts from 'rollup-plugin-dts';

const entriesDir = 'types-tmp';
const outDir = 'dist';

export default {
    input: path.join(entriesDir, 'index.d.ts'),
    output: {
        file: path.join(outDir, `typed-ui.d.ts`),
        format: 'es',
    },
    plugins: [dts()],
};
