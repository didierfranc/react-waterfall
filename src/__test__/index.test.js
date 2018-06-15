/* global store */
import React from 'react'
import renderer from 'react-test-renderer'

import createStore from '../'

global.console = { ...console, error: jest.fn() }

const mockFetch = () => new Promise(resolve => {
  setTimeout(() => {
    expect(true).toBe(true) // we add this to make sure (in test) that this procedure was called
    resolve({ stars: 1e10 })
  }, 100)
});

// custom api fetch middleware example (input - api request, output - action)
const customAPIMiddleware = _ => next => async action => {
  const { type, args } = action
  if (type === 'fetch') {
    const what = args[0]
    switch (what) {
      case 'stars': {
        const response = await mockFetch()
        return next({ ...action, type: 'setStars', args: [response.stars]})
      }
    }
  }
  next(action)
}

// thunk (async) middleware example (input - promise creator, output - none)
const thunkMiddleware = ({ actionsCreators, getState, broadcast }, self) => next => async action => {
  const { type, args, resolve } = action
  if (type.endsWith('Async')) {
    const state = getState()
    const result = await actionsCreators[type](state, ...args);
    // note: we intercept and apply the state change right away, so we also need to broadcast and resolve
    return self.setState(result, () => {
      broadcast(action)
      resolve()
    })}
  next(action)
}

beforeEach(() => {
  const config = {
    initialState: {
      count: 0,
      stars: null,
    },
    actionsCreators: {
      increment: ({ count }) => ({ count: count + 1 }),

      fetch: 0, // usage example: actions.fetch('stars')
      setStars: (_, stars) => ({ stars }),

      getStarsAsync: async (/*state, ...args*/) => {
        const result = await mockFetch()
        return { stars: result.stars }
      },
    }
  }

  global.store = createStore(config, [
    customAPIMiddleware,
    thunkMiddleware
  ])
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

test('async actions - thunk example', async () => {  expect.assertions(2)

  const { Provider, connect, actions } = store

  const Stars = connect(({ stars }) => ({ stars }))(({ stars }) => stars)

  const App = () => (
    <Provider>
      <Stars />
    </Provider>
  )

  const tree = renderer.create(<App />)

  await actions.getStarsAsync()

  const instance = tree.root.findByType(Stars).children[0]
  expect(typeof instance.props.stars).toBe('number')
})


test('async actions - custom api middleware example', async () => {  expect.assertions(2)

  const { Provider, connect, actions } = store

  const Stars = connect(({ stars }) => ({ stars }))(({ stars }) => stars)

  const App = () => (
    <Provider>
      <Stars />
    </Provider>
  )

  const tree = renderer.create(<App />)

  await actions.fetch('stars')

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
