/* global store */
import React from 'react'
import renderer from 'react-test-renderer'

import createStore from '../'

global.console = { error: jest.fn() }

beforeEach(() => {
  const config = {
    initialState: {
      count: 0,
    },
    actionsCreators: {
      increment: ({ count }) => ({ count: count + 1 }),
    },
  }

  global.store = createStore(config)
})

test('store initialization', () => {
  expect(store.Provider).toBeDefined()
  expect(store.connect).toBeDefined()
  expect(store.actions).toBeDefined()
  expect(store.subscribe).toBeDefined()
  expect(store.unsubscribe).toBeDefined()
})

test('render provider with its children', () => {
  const { Provider } = store
  const App = () => (
    <Provider>
      <h1>Children</h1>
    </Provider>
  )

  const tree = renderer.create(<App />).toJSON()
  expect(tree).toMatchSnapshot()
})

test('call console.error if an action is called before Provider initialization', () => {
  const { actions } = store
  actions.increment()
  expect(console.error).toBeCalledWith('<Provider /> is not initialized yet')
})

test('actions triggered and state updated', () => {
  const { Provider, connect, actions } = store

  const Count = connect(({ count }) => ({ count }))(({ count }) => count)

  const App = () => (
    <Provider>
      <Count />
    </Provider>
  )
  const tree = renderer.create(<App />)
  expect(tree.toJSON()).toMatchSnapshot()

  actions.increment()
  expect(tree.toJSON()).toMatchSnapshot()
})
