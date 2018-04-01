// @flow
import React, { Component, PureComponent, createContext, forwardRef } from 'react'

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

  let calculateChangedBits = undefined
  let observableMap
  if (store.observables) {
    if (!Array.isArray(store.observables) || typeof store.observables[0] !== 'string') {
      console.log(`[react-waterfall] Expected 'observables' to be an array of strings. Instead received: ${typeof store.observables}`)
    }
    else if (store.observables.length > 29) { // We ask
      console.log(`[react-waterfall] Expected maximum length of 'observables' array to be 29. Instead received: ${store.observables.length}`)
    }
    else {
      observableMap = store.observables.reduce((map, key, idx) => {
        map[key] = 1 << (idx + 1) // key: 2^(index+1) - starting with 2 (=2^1)
        return map
      }, { '*': 1 }) // Everything is 1
      calculateChangedBits = (oldState, newState) => store.observables
        .filter(key => oldState[key] !== newState[key]) // only changed fields
        .reduce((sum, key) => sum + (observableMap[key] || 0),
          oldState !== newState ? 1 : 0) // sum their values, starting with the LSB if state was changed at all
    }
  }

  const Context = createContext(store.initialState, calculateChangedBits)

  const getState = () => (self ? self.state : err())
  const setState = (action, state, args) => {
    subscriptions.forEach(fn => fn(action, state, args))
    self.setState(state, () => initializedMiddlewares.forEach(m => m(action, args)))
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
            ? result.then(result => setState(v, result, args))
            : setState(v, result, args)
        } else {
          err()
        }
      },
    }),
    {},
  )

  class Consumer extends Component {
    props: {
      children: Function,
      observed: Number
    }
    // We do this so the sCU of Prevent will ignore the children prop
    _children = () => this.props.children

    prevent = ({ state, actions }) => {
      const { mapStateToProps } = this.props
      return (
        <Prevent {...mapStateToProps(state)} actions={actions} _children={this._children} />
      )
    }

    render() {
      const { observed } = this.props
      return (
        <Context.Consumer unstable_observedBits={observed && observed.reduce((sum, key) => sum + (observableMap[key] || 0), 0)} >
          {this.prevent}
        </Context.Consumer>
      )
    }
  }

  const connect = (mapStateToProps, observed) => WrappedComponent => {
    const ConnectComponent = forwardRef((props, ref) =>
      <Consumer mapStateToProps={mapStateToProps} observed={observed}>
        {injectedProps => <WrappedComponent {...props} {...injectedProps} ref={ref}/>}
      </Consumer>)
    ConnectComponent.displayName = `Connect(${WrappedComponent.displayName || WrappedComponent.name || 'Unknown'})`
    return ConnectComponent
  }

  class Provider extends Component<*> {
    constructor() {
      super()
      self = this
      this.state = store.initialState
      initializedMiddlewares = middlewares.map(m => m(store, self))
      this.value = { actions, state: this.state }
    }

    render() {
      if (this.state !== this.value.state) {
        // If state was changed then recreate `this.value` so it will have a different reference
        // Explained here: https://reactjs.org/docs/context.html#caveats
        this.value = { actions, state: this.state }
      }
      return (
        <Context.Provider
          value={this.value}
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
