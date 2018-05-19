import React from 'react'
import renderer from 'react-test-renderer'

import createStore from '../'

const config = {
  initialState: {
    count: 0,
  },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
  },
}

global.console = { error: jest.fn() }

test('store initialization', () => {
  const store = createStore(config)

  expect(store.Provider).toBeDefined()
  expect(store.connect).toBeDefined()
  expect(store.actions).toBeDefined()
  expect(store.subscribe).toBeDefined()
  expect(store.unsubscribe).toBeDefined()
})

test('render provider with its children', () => {
  const { Provider } = createStore(config)

  const App = () => (
    <Provider>
      <h1>Children</h1>
    </Provider>
  )

  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('call console.error if an action is called before Provider initialization', () => {
  const { actions } = createStore(config)
  actions.increment()
  expect(console.error).toBeCalledWith('<Provider /> is not initialized yet')
})
