// @flow
/* eslint-disable no-undef */

import { createContext } from 'react'

import createProvider from './Components/Provider'
import createConnect from './helpers/connect'
import Subscriptions from './helpers/subscriptions'

import type {
  CreateStore,
  ProviderType,
  SetProvider,
  CustomSetState,
  Context,
} from './types'

const createStore: CreateStore = (
  { initialState, actions: actionsCreators = {} },
  middlewares = [],
) => {
  let provider: ProviderType
  const context: Context = createContext()

  const { getSubscriptions, subscribe, unsubscribe } = new Subscriptions()

  const setProvider: SetProvider = self => {
    const initializedMiddlewares = middlewares.map(middleware =>
      middleware({ initialState, actionsCreators }, self, actions))

    provider = {
      getState: () => self.state,
      setState: (state, callback) => self.setState(state, callback),
      initializedMiddlewares,
    }
  }

  const setState: CustomSetState = (action, state, args) => {
    const subscriptions = getSubscriptions()
    subscriptions.forEach(fn => fn(action, state, args))
    provider.setState(state, () =>
      provider.initializedMiddlewares.forEach(m => m(action, args)))
  }

  const actions = Object.keys(actionsCreators).reduce(
    (r, v) => ({
      ...r,
      [v]: (...args) => {
        if (!provider) {
          console.error('<Provider /> is not initialized yet')
          return
        }
        const result = actionsCreators[v](provider.getState(), ...args)
        if (result.then) result.then(res => setState(v, res, args))
        else setState(v, result, args)
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
