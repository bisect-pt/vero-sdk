import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                file: 'dist/index.js',
                format: 'cjs',
                exports: 'named',
                sourcemap: true,
            },
            {
                file: 'dist/index.es.js',
                format: 'es',
                exports: 'named',
                sourcemap: true,
            },
        ],
        plugins: [
            typescript({
                declaration: true,
            }),
            resolve(),
            terser(),
        ],
    },
    {
        input: './build/index.d.ts',
        output: [{ file: 'dist/index.d.ts', format: 'cjs' }],
        plugins: [dts()],
    },
];
