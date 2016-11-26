// rollup.config.js
import typescript from 'rollup-plugin-typescript';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: './lib/index.ts',
  treeshake: true,
  moduleName: 'matejs',
  plugins: [
    typescript({
      typescript: require('typescript')
    }),
    nodeResolve({ jsnext: true, main: true }),
    commonjs()
  ],
  targets: [
    { dest: 'dist/index.cjs.js', format: 'cjs' },
    { dest: 'dist/index.js', format: 'umd' },
    { dest: 'dist/index.es.js', format: 'es' },
  ]
}