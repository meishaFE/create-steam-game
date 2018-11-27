import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import strip from 'rollup-plugin-strip';
import pkg from './package.json';
import { uglify } from 'rollup-plugin-uglify';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

const intro = '/* power by JxJayden v0.2 */';

export default [
  // browser-friendly UMD build
  {
    input: './src/index.js',
    output: [
      {
        name: 'steamgame',
        intro,
        file: pkg.browser,
        exports: 'named',
        format: 'iife'
      }
    ],
    plugins: [
      resolve({
        browser: true
      }),
      commonjs({
        // non-CommonJS modules will be ignored, but you can also
        // specifically include/exclude files
        include: 'node_modules/**' // Default: undefined
      }),
      babel({
        exclude: 'node_modules/**' // 只编译我们的源代码
      }),
      strip(),
      cleanup(),
      uglify()
    ]
  }
];
