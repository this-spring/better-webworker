import { uglify } from 'rollup-plugin-uglify';
import typescript from 'rollup-plugin-typescript2';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs'  

export default {
    input: 'src/index.ts',
    output: {
        file: `dist/BetterWorker.min.js`,
        format: 'umd',
        name: 'BetterWorker',
        sourceMap: false,
    },
    plugins: [
        resolve(),
        uglify(),
        commonjs({}),
        typescript({
            tsconfig: './tsconfig.json',
            verbosity: 3,
        }),
    ],
};