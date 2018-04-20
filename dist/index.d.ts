declare module 'react-waterfall' {

  import React from 'react'

  declare type State = any
  declare type Self = any
  declare type Action = (state: State) => any
  declare type Actions = { [key: string]: Action }
  declare type Subscriber = (action: Action, state: State) => void

  declare type Store = {
    initialState: State
    actions: Actions
  }

  declare type Middleware = (store: Store, self: Self) => (action: string) => void

  declare export const initStore: (
    state: any,
    middlewares?: Middleware[],
  ) => {
    Provider: React.Component<any>
    Consumer: React.Component<any>
    connect: (state: any) => (component: React.Component<any>) => React.Component<any>
    actions: Actions
    getState: () => State
    subscribe: Subscriber
  }
}
