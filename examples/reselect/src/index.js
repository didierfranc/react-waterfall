import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import { Provider } from './store'

ReactDOM.render(
  <Provider>
    <App />
  </Provider>,
  document.getElementById('root'),
)
