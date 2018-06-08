/* global store */
import React from 'react'
import renderer from 'react-test-renderer'

import createStore from '../'

global.console = { ...console, error: jest.fn() }

const mockFetch = () => new Promise(resolve => setTimeout(() => resolve({ stars: 1e10 })), 100);

beforeEach(() => {
  const config = {
    initialState: {
      count: 0,
      stars: null,
    },
    actionsCreators: {
      increment: ({ count }) => ({ count: count + 1 }),
      getStars: async () => {
        return await mockFetch()
      },
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

test('async actions', async () => {
  const { Provider, connect, actions } = store

  const Stars = connect(({ stars }) => ({ stars }))(({ stars }) => stars)

  const App = () => (
    <Provider>
      <Stars />
    </Provider>
  )

  const tree = renderer.create(<App />)
  await actions.getStars()

  const instance = tree.root.findByType(Stars).children[0]
  expect(typeof instance.props.stars).toBe('number')
})

test('consecutive actions update state accordingly', () => {
  const { Provider, connect, actions } = store

  class PlusTwoOnMountCount extends React.Component {
    componentDidMount() {
      actions.increment()
      actions.increment()
    }
    render() {
      return this.props.count;
    }
  }
  const Count = connect(({ count }) => ({ count }))(PlusTwoOnMountCount)

  const App = () => (
    <Provider>
      <Count />
    </Provider>
  )
  const tree = renderer.create(<App />)
  expect(tree.toJSON()).toMatchSnapshot()
})
