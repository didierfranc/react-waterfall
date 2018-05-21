if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/react-waterfall.min.js')
} else {
  module.exports = require('./dist/react-waterfall.dev.js')
}
