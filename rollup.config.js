import scss from 'rollup-plugin-scss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';

export default {
  input: '_es6/main.js',
  output: {
    dir: 'js',
    format: 'es',
  },
  jsx: {
    mode: 'automatic',
  },
  plugins: [
    json(),
    scss({
      output: 'css/main.css', // This specifies the output file for the compiled CSS
    }),
    resolve(),
    commonjs({ include: /node_modules/ }),
  ]
};
