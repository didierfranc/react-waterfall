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
      doNothing: () => {},
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

test('connect(): allow ownprops from mapStateToProps', async () => {
  const { Provider, connect, actions } = store

  const Stars = connect(({ stars }, { multiply }) => ({ stars: stars * multiply }))(({ stars }) => stars)

  const App = () => (
    <Provider>
      <Stars multiply={2} />
    </Provider>
  )
  const tree = renderer.create(<App />)
  await actions.getStars()

  const instance = tree.root.findByType(Stars).children[0]
  expect(instance.props.stars).toBe(20000)
})

test('state is not updated when nothing is returned', async () => {
  const { Provider, connect, actions } = store
  const didUpdateSpy = jest.fn()

  /* eslint-disable react/no-multi-comp,react/prop-types */
  class Count extends React.PureComponent {
    componentDidUpdate() {
      didUpdateSpy()
    }

    render() {
      return this.props.count
    }
  }
  const ConnectedCount = connect(({ count }) => ({ count }))(Count)
  /* eslint-enable */

  const App = () => (
    <Provider>
      <ConnectedCount />
    </Provider>
  )
  const tree = renderer.create(<App />)

  const instance = tree.root.findByType(ConnectedCount).children[0]
  instance.componentDidUpdate = jest.fn()
  expect(tree.toJSON()).toMatchSnapshot()

  await actions.increment()
  expect(didUpdateSpy).toHaveBeenCalledTimes(1)
  await actions.increment()
  expect(didUpdateSpy).toHaveBeenCalledTimes(2)
  actions.doNothing()
  expect(didUpdateSpy).toHaveBeenCalledTimes(2)
  expect(tree.toJSON()).toMatchSnapshot()
})
