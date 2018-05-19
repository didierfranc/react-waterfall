import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/react-waterfall.js',
    format: 'cjs',
  },
  plugins: [babel({ exclude: 'node_modules/**' }), uglify()],
  external: ['react'],
}
