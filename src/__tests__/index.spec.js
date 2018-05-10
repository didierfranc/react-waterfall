import React from 'react';
import { initStore } from '../index'
import renderer from 'react-test-renderer';

const mockStore = {
  initialState: { count: 0 },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
    promised: ({ count }) => new Promise(resolve => resolve({ count: count + 1 }))
  },
}

const TestCount = ({ beforeRender, ...rest }) => {
  beforeRender && beforeRender(rest)
  return null
}
TestCount.displayName = 'TestCount'

describe('initStore', () => {
  test('should return expected structure', () => {
    const storeContext = initStore(mockStore)

    expect(storeContext.Provider).toBeDefined()
    expect(storeContext.Consumer).toBeDefined()
    expect(storeContext.actions).toBeDefined()
    expect(storeContext.getState).toBeDefined()
    expect(storeContext.connect).toBeDefined()
    expect(storeContext.subscribe).toBeDefined()
    expect(storeContext.unsubscribe).toBeDefined()
  })

  test('should fail an action if provider not initialized', () => {
    const { connect, actions } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    jest.spyOn(global.console, 'error')
    actions.increment()
    expect(console.error).toBeCalled()
  })

  test('should fail getState if provider not initialized', () => {
    const { connect, getState } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    jest.spyOn(global.console, 'error')
    getState()
    expect(console.error).toBeCalled()
  })

  test('should add a displayName to the connected component (component with displayName)', () => {
    const { connect } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    expect(Count.displayName).toBe('Connect(TestCount)')
  })

  test('should add a displayName to the connected component (named function)', () => {
    const { connect } = initStore(mockStore)
    const funcWithName = () => null
    const Count = connect(state => state)(funcWithName)
    expect(Count.displayName).toBe('Connect(funcWithName)')
  })

  test('should add a displayName to the connected component (anonymous function)', () => {
    const { connect } = initStore(mockStore)
    const Count = connect(state => state)(() => null)
    expect(Count.displayName).toBe('Connect(Unknown)')
  })

  test('should change value on action', () => {
    const { connect, Provider, actions, getState } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    );
    expect(getState().count).toBe(0)
    actions.increment()
    component.toJSON() // invoke render
    expect(getState().count).toBe(1)
  })

  test('should call subscribers on state change', () => {
    const { connect, Provider, actions, subscribe } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = jest.fn()
    subscribe(subscriber)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    );
    actions.increment()
    component.toJSON() // invoke render
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  test('should remove subscribers on unsubscribe', () => {
    const { connect, Provider, actions, subscribe, unsubscribe } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = jest.fn()
    subscribe(subscriber)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    );
    unsubscribe(subscriber)
    actions.increment()
    component.toJSON() // invoke render
    expect(subscriber).toHaveBeenCalledTimes(0)
  })

  test('should allow action to return a promise', () => {
    const { connect, Provider, actions, subscribe } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = (action, state) => {
      expect(action).toEqual('promised')
      expect(state).toEqual({ count: 1 })
    }
    subscribe(subscriber)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    )
    expect.assertions(2); // async
    actions.promised()
    component.toJSON() // invoke render
  })

  test('should allow use of middleware', () => {
    const middleware = jest.fn(action => expect(action).toBe('increment'))
    const middlewareWrapper = jest.fn((store, self) => {
      expect(store).toBe(mockStore)
      expect(self.state.count).toBe(0)
      return middleware
    })
    const { connect, Provider, actions } = initStore(mockStore, middlewareWrapper)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    );
    expect.assertions(3); // async
    actions.increment()
    component.toJSON() // invoke render
  })

})