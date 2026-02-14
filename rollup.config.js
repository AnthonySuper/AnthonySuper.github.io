import scss from 'rollup-plugin-scss';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import babel from '@rollup/plugin-babel';
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars';
import replace from '@rollup/plugin-replace';

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
    replace({
      // preventAssignment is a required option in newer versions
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify('production'),
    }),
    scss({
      output: 'css/main.css', // This specifies the output file for the compiled CSS
    }),
    resolve({
      extensions: ['.js', '.jsx'],
    }),
    commonjs({ include: /node_modules/ }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      exclude: 'node_modules/**',
    }),
    dynamicImportVars(),
  ]
};
