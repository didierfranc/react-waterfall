// @flow
import React from 'react'

export { default as Provider } from './Provider'
export { default as Consumer } from './Consumer'
export { default as connect } from './connect'

function err() { console.error('Provider is not attached yet') }

function setState(action, state, args) {
  this.subscribers.forEach(fn => fn(action, state, args))
  this.provider.setState(state, () => this.middlewares.forEach(m => m(action, args)))
}

class Store {
  constructor(config, ...middlewareFactories) {
    this.config = config
    this.context = React.createContext()
    this.initialState = config.initialState
    this.factories = middlewareFactories
    this.middlewares = []
    this.provider = null
    this.subscribers = []
    this.actions = Object.keys(config.actions).reduce(
      (r, v) => ({
        ...r,
        [v]: (...args) => {
          if (this.provider) {
            let result = config.actions[v](this.provider.state, ...args)
            result.then
              ? result.then(result => setState.call(this, v, result, args))
              : setState.call(this, v, result, args)
          } else {
            err()
          }
        },
      }),
      {},
    )
  }

  getState = () => (this.provider ? this.provider.state : err())

  attach = provider => {
    this.provider = provider
    this.middlewares = this.factories.map(m => m(this.config, this.provider, this.actions))
  }

  subscribe = fn => {
    this.subscribers = [...this.subscribers, fn]
  }
}

export const initStore = (store, ...middlewares) => new Store(store, ...middlewares)
