import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-waterfall'
import store from './store'
import App from './components/App'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root'),
)
