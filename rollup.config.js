import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'
import replace from 'rollup-plugin-replace'

export default [
  {
    input: 'src/index.js',
    output: {
      file: 'dist/react-waterfall.min.js',
      format: 'cjs',
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
    ],
    external: ['react'],
  },
  {
    input: 'src/index.js',
    output: {
      file: 'dist/react-waterfall.dev.js',
      format: 'cjs',
    },
    plugins: [
      babel({ exclude: 'node_modules/**' }),
      uglify(),
      replace({
        'process.env.NODE_ENV': JSON.stringify('development'),
      }),
    ],
    external: ['react'],
  },
]
