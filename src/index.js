// @flow
/* eslint-disable no-undef */

import { createContext } from 'react'

import createProvider from './Components/Provider'
import createConnect from './helpers/connect'
import Subscriptions from './helpers/subscriptions'
import devtools from './helpers/devtools'

import type {
  ActionObject,
  CreateStore,
  ProviderType,
  SetProvider,
  Context,
  Middleware,
} from './types'

const developmentMiddlewares =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  window.devToolsExtension
    ? [devtools]
    : []

const createStore: CreateStore = (
  { initialState, actionsCreators = {} },
  middlewares : Middleware[] = [],
) => {
  let provider: ProviderType
  const context: Context = createContext()

  const { getSubscriptions, subscribe, unsubscribe } = new Subscriptions()

  let actions;
  
  // the last middleware in the pipeline that:
  // 1. sets the state
  // 2. broadcasts the change to the subscribers
  const setStateMiddleware : Middleware = ({ broadcast, actionsCreators }, self) => (/*next*/) => (action: ActionObject) => {
    const { type, args, resolve } = action
    self.setState(
      // functional setState
      prevState => actionsCreators[type](prevState, actions,...args),
      // setState callback, update middleware, update subscribers
      () => {
        broadcast(action)
        resolve()
      }
    )
  }

  // bind action creators to dispatch
  actions = Object.keys(actionsCreators).reduce(
    (accumulator, type) => {
      accumulator[type] = (...args) => {
        if (!provider) {
          console.error('<Provider /> is not initialized yet')
          return
        }
        return provider.dispatch({ type, args })
      }
      return accumulator
    },
    {},
  )

  const setProvider: SetProvider = self => {

    // bind all middleware
    const middleware = [
      ...developmentMiddlewares,
      ...middlewares,
      setStateMiddleware
    ]

    const dispatch = (action : ActionObject) => new Promise((resolve, reject) => {
      middleware[0]({ ...action, resolve, reject })
    });

    provider = {
      getState: () => self.state,
      dispatch,
      actions,
      actionsCreators,
      broadcast: (action: ActionObject) => {
        const state = self.state
        const subscriptions = getSubscriptions()
        subscriptions.forEach(fn => fn(action.type, state, ...action.args))
      }
    }

    for (let i = middleware.length - 1; i >= 0; i--) {
      // bind with provider and self
      middleware[i] = middleware[i](provider, self);
      // bind next with next middleware (the loop goes backwards)
      middleware[i] = middleware[i](middleware[i+1]);
    }

  }

  const Provider = createProvider(setProvider, context.Provider, initialState)
  const connect = createConnect(context.Consumer)

  return {
    Provider,
    connect,
    actions,
    subscribe,
    unsubscribe,
  }
}

export default createStore
