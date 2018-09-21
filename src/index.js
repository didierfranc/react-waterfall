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
      setState: (state, callback) => self.setState(state, callback),
      initializedMiddlewares,
    }
  }

  let state = initialState

  const setState: CustomSetState = (action, result, ...args) => {
    state = { ...state, ...result }
    return new Promise(resolve => {
      const subscriptions = getSubscriptions()
      subscriptions.forEach(fn => fn(action, result, ...args))
      provider.setState(state, () => {
        provider.initializedMiddlewares.forEach(m => m(action, ...args))
        resolve()
      })
    })
  }

  const actions = Object.keys(actionsCreators).reduce(
    (r, v) => ({
      ...r,
      [v]: (...args) => {
        if (!provider) {
          console.error('<Provider /> is not initialized yet')
          return
        }

        const result = actionsCreators[v](state, actions, ...args)

        if (typeof result === 'function') {
          return result(newState => setState(v, newState, ...args));
        }

        return result.then
          ? result.then(result => setState(v, result, ...args))
          : setState(v, result, ...args)
      },
    }),
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
