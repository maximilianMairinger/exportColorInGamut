import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonJS from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'


export default {
  input: 'code.ts',
  output: {
    file: 'code.js',
    format: 'cjs',
    // sourcemap: true
  },
  // sourcemap: true,
  plugins: [
    typescript({tsconfig: "./tsconfig.json", noEmitOnError: false}), 
    resolve({browser: true}),
    commonJS({
      include: 'node_modules/**',
      
    }),
    json(),
  ]
};
