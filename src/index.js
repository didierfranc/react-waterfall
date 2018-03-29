// @flow
import React, { Component, PureComponent, createContext } from 'react'

const err = () => console.error('Provider is not initialized yet')

class Prevent extends PureComponent<*> {
  render() {
    const { _children, ...rest } = this.props;
    return _children()(rest)
  }
}

export const initStore: Function = (store, ...middlewares) => {
  let self, initializedMiddlewares
  let subscriptions = []
  const Context = createContext()

  const getState = () => (self ? self.state : err())
  const setState = (action, state) => {
    subscriptions.forEach(fn => fn(action, state))
    self.setState(state, () => initializedMiddlewares.forEach(m => m(action)))
  }

  const subscribe = fn => {
    subscriptions = [...subscriptions, fn]
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

  class Consumer extends Component {

    // We do this so the sCU of Prevent will ignore the children prop
    _children = () => this.props.children

    prevent = ({ state, actions }) => {
      const { mapStateToProps } = this.props
      return (
        <Prevent {...mapStateToProps(state)} actions={actions} _children={this._children} />
      )
    }

    render() {
      return (
        <Context.Consumer>
          {this.prevent}
        </Context.Consumer>
      )
    }
  }

  const connect = mapStateToProps => WrappedComponent => {
    const ConnectComponent = props =>
      <Consumer mapStateToProps={mapStateToProps}>
        {injectedProps => <WrappedComponent {...props} {...injectedProps} />}
      </Consumer>
    ConnectComponent.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name || 'Unknown'})`
    return ConnectComponent
  }

  class Provider extends Component<*> {
    constructor() {
      super()
      self = this
      this.state = store.initialState
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
    subscribe,
  }
}
