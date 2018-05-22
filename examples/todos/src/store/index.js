import createStore from 'react-waterfall'

import initialState from './state'
import actionsCreators from './actions'

const config = {
  initialState,
  actionsCreators,
}

export const { Provider, connect, actions } = createStore(config)
