// @flow
import React, { Component, createContext } from 'react'
import shallowEqual from 'fbjs/lib/shallowEqual'

const err = () => console.error('Provider is not rendered yet')

class Prevent extends Component<*> {
  shouldComponentUpdate = ({ state, select }) =>
    select.some(
      selector => !shallowEqual(this.props.state[selector], state[selector]),
    )

  render() {
    const { actions, select, state, children } = this.props
    const selected = select.reduce((r, v) => ({ ...r, [v]: state[v] }), {})
    return children({ state: selected, actions })
  }
}

export const initStore: Function = (store, ...middlewares) => {
  let self, initializedMiddlewares
  const Context = createContext()

  const getState = () => (self ? self.state : err())
  const setState = (action, state) => {
    self.setState(state, () => initializedMiddlewares.forEach(m => m(action)))
  }

  const actions = Object.keys(store.actions).reduce(
    (r, v) => ({
      ...r,
      [v]: (...args) => {
        if (self) {
          let result = store.actions[v](self.state, ...args)
          result.then
            ? result.then(result => setState(v, result))
            : setState(v, result)
        } else {
          err()
        }
      },
    }),
    {},
  )

  const Consumer = ({ children, select }) => (
    <Context.Consumer>
      {({ state, actions }) => (
        <Prevent select={select} state={state} actions={actions}>
          {children}
        </Prevent>
      )}
    </Context.Consumer>
  )

  const connect = select => Cmpnt => props => {
    return (
      <Consumer select={select}>
        {({ state }) => <Cmpnt {...props} state={state} actions={actions} />}
      </Consumer>
    )
  }

  class Provider extends Component<*> {
    state = store.initialState

    componentDidMount() {
      self = this
      initializedMiddlewares = middlewares.map(m => m(store, self))
    }

    render() {
      return (
        <Context.Provider
          value={{
            state: this.state,
            actions,
          }}
        >
          {this.props.children}
        </Context.Provider>
      )
    }
  }

  return {
    Provider,
    Consumer,
    actions,
    getState,
    connect,
  }
}
