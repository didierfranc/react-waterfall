import React from 'react';
import { initStore } from '../src/index'
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

describe('initStore', () => {
  test('should return expected structure', () => {
    const storeContext = initStore(mockStore)

    expect(storeContext.Provider).toBeDefined()
    expect(storeContext.Consumer).toBeDefined()
    expect(storeContext.actions).toBeDefined()
    expect(storeContext.getState).toBeDefined()
    expect(storeContext.connect).toBeDefined()
    expect(storeContext.subscribe).toBeDefined()
  })

  test('should fail an action if provider not initialized', () => {
    const { connect, Provider, actions, getState } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    jest.spyOn(global.console, 'error')
    actions.increment()
    expect(console.error).toBeCalled()
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

  xtest('should allow action to return a promise', () => {
    const { connect, Provider, actions, subscribe } = initStore(mockStore)
    const Count = connect(state => ({ count: state.count }))(TestCount)
    const subscriber = jest.fn()
    subscribe(subscriber)
    const component = renderer.create(
      <Provider>
        <Count />
      </Provider>
    )
    actions.promised()
    component.toJSON() // invoke render
    component.update()
    expect(subscriber).toHaveBeenCalledWith('promised', { count: 1 })
  })
})