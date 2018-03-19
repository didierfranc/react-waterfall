import { initStore } from 'react-waterfall'

import { increment } from './actions'
import { _score } from './selectors'

const store = {
  initialState: {
    count: 0,
    _score: 0,
  },
  actions: {
    increment,
    _score,
  },
}

// a middleware that calls _selector every time an action is triggered
// this could be integrated by default in a future version
function derivedDataProposal(store, self) {
  const isDerived = action => action.startsWith('_')

  return function(action) {
    if (isDerived(action)) return

    Object.keys(actions)
      .filter(isDerived)
      .forEach(action => actions[action](self.state))
  }
}

export const { Provider, actions, connect } = initStore(
  store,
  derivedDataProposal,
)
