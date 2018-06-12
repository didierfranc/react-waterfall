/* global store */
import React, { Component } from 'react'
import renderer from 'react-test-renderer'

import createStore from '../'

global.console = { ...console, error: jest.fn() }

const fakeFetch = () => new Promise(resolve => resolve({ stars: 10000 }))

beforeEach(() => {
  const config = {
    initialState: {
      count: 0,
      stars: null,
    },
    actionsCreators: {
      increment: ({ count }) => ({ count: count + 1 }),
      getStars: async () => {
        const { stars } = await fakeFetch()
        return { stars }
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

test('consecutive actions calls inside didMount', () => {
  const { Provider, connect, actions } = store

  const Count = connect(({ count }) => ({ count }))(({ count }) => count)

  class App extends Component {
    componentDidMount() {
      actions.increment()
      actions.increment()
    }
    render() {
      return (
        <Provider>
          <Count />
        </Provider>
      )
    }
  }

  const tree = renderer.create(<App />)

  const instance = tree.root.findByType(Count).children[0]
  expect(instance.props.count).toBe(2)
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
