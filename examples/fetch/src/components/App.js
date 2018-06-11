import React from 'react'

import { Provider } from '../store'

import Movies from './Movies'
import Load from './Load'

const App = () => (
  <Provider>
    <Movies />
    <Load />
  </Provider>
)
export default App
