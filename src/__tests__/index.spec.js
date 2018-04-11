import React from 'react';
import { initStore, Provider, connect } from '../index'
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
  let storeContext

  beforeEach(() => {
    storeContext = initStore(mockStore)
  })

  test('should return expected structure', () => {
    expect(storeContext.config).toBeDefined()
    expect(storeContext.context).toBeDefined()
    expect(storeContext.initialState).toBeDefined()
    expect(storeContext.actions).toBeDefined()
    expect(storeContext.provider).toBeNull()
    expect(storeContext.subscribers).toHaveLength(0)
    expect(storeContext.factories).toHaveLength(0)
    expect(storeContext.middlewares).toHaveLength(0)
    expect(storeContext.getState).toBeDefined()
    expect(storeContext.attach).toBeDefined()
    expect(storeContext.subscribe).toBeDefined()
  })

  test('should fail an action if provider not initialized', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    jest.spyOn(global.console, 'error')
    storeContext.actions.increment()
    expect(console.error).toBeCalled()
  })

  test('should fail getState if provider not initialized', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    jest.spyOn(global.console, 'error')
    storeContext.getState()
    expect(console.error).toBeCalled()
  })

  test('should add a displayName to the connected component (component with displayName)', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    expect(Count.displayName).toBe('Connect(TestCount)')
  })

  test('should add a displayName to the connected component (named function)', () => {
    const funcWithName = () => null
    const Count = connect(state => state)(funcWithName)
    expect(Count.displayName).toBe('Connect(funcWithName)')
  })

  test('should add a displayName to the connected component (anonymous function)', () => {
    const Count = connect(state => state)(() => null)
    expect(Count.displayName).toBe('Connect(Unknown)')
  })

  test('should change value on action', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const component = renderer.create(
      <Provider store={storeContext}>
        <Count />
      </Provider>
    );
    expect(storeContext.getState().count).toBe(0)
    storeContext.actions.increment()
    component.toJSON() // invoke render
    expect(storeContext.getState().count).toBe(1)
  })

  test('should call subscribers on state change', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = jest.fn()
    storeContext.subscribe(subscriber)
    const component = renderer.create(
      <Provider store={storeContext}>
        <Count />
      </Provider>
    );
    storeContext.actions.increment()
    component.toJSON() // invoke render
    expect(subscriber).toHaveBeenCalledTimes(1)
  })

  test('should allow action to return a promise', () => {
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = (action, state) => {
      expect(action).toEqual('promised')
      expect(state).toEqual({ count: 1 })
    }
    storeContext.subscribe(subscriber)
    const component = renderer.create(
      <Provider store={storeContext}>
        <Count />
      </Provider>
    )
    expect.assertions(2); // async
    storeContext.actions.promised()
    component.toJSON() // invoke render
  })

  test('should allow use of middleware', () => {
    const middleware = jest.fn(action => expect(action).toBe('increment'))
    const middlewareWrapper = jest.fn((store, self) => {
      expect(store).toBe(mockStore)
      expect(self.state.count).toBe(0)
      return middleware
    })
    storeContext = initStore(mockStore, middlewareWrapper)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const component = renderer.create(
      <Provider store={storeContext}>
        <Count />
      </Provider>
    );
    expect.assertions(3); // async
    storeContext.actions.increment()
    component.toJSON() // invoke render
  })

})
