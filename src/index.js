// @flow
/* eslint-disable no-undef */

import { createContext } from 'react'

import createProvider from './Components/Provider'
import createConnect from './helpers/connect'
import Subscriptions from './helpers/subscriptions'
import devtools from './helpers/devtools'

import type {
  CreateStore,
  ProviderType,
  SetProvider,
  CustomSetState,
  Context,
} from './types'

const defaultMiddlewares =
  process.env.NODE_ENV === 'development' &&
  typeof window !== 'undefined' &&
  window.devToolsExtension
    ? [devtools]
    : []

const createStore: CreateStore = (
  { initialState, actionsCreators = {} },
  middlewares = [],
) => {
  let provider: ProviderType
  const context: Context = createContext()

  const { getSubscriptions, subscribe, unsubscribe } = new Subscriptions()

  const setProvider: SetProvider = self => {
    const initializedMiddlewares = [...middlewares, ...defaultMiddlewares].map(middleware =>
      middleware({ initialState, actionsCreators }, self, actions))

    provider = {
      getState: () => self.state,
      setState: (state, callback) => self.setState(state, callback),
      initializedMiddlewares,
    }
  }

  const setState: CustomSetState = (action, ...args) =>
    new Promise(resolve => {
      provider.setState(
        // functional setState
        prevState => actionsCreators[action](prevState, ...args),
        // setState callback, update middleware, update subscribers
        () => {
          const state = provider.getState()
          provider.initializedMiddlewares.forEach(m => m(action, state, ...args))

          const subscriptions = getSubscriptions()
          subscriptions.forEach(fn => fn(action, state, ...args))

          resolve()
        }
      )
    })

  const actions = Object.keys(actionsCreators).reduce(
    (accumulator, actionName) => {
      accumulator[actionName] = (...args) => {
        if (!provider) {
          console.error('<Provider /> is not initialized yet')
          return
        }
        return setState(actionName, ...args)
      }
      return accumulator
    },
    {},
  )

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
