// @flow
/* eslint-disable no-undef */

export type State = { [string]: any }

type SetState = (state: State, callback: () => void) => void
export type ActionObject = {
  type: string,
  args: [],
  resolve: function,
  reject: function
}
type Dispatch = (ActionObject) => Promise<void>

type Self = {
  state: State,
  setState: SetState,
}

type Action = (State, {}) => any
type Actions = { [string]: Action }
type BoundActions = ({}) => any

type Config = {
  initialState: State,
  actionsCreators: Actions,
}

export type Middleware =
  (provider: ProviderType, self: Self) =>
    (next: ActionObject => any) =>
    (action: ActionObject) => void

export type ProviderType = {
  getState: () => State,
  dispatch: Dispatch,
  actions: { [string]: BoundActions },
  actionsCreators: Actions,
  broadcast: ActionObject => any
}

type Consumer = React$ComponentType<{
  children: (state: State | void) => React$Node,
}>

export type Context = {
  Consumer: Consumer,
  Provider: React$ComponentType<*>,
}

type MapStateToProps = (state: State) => State

type Connect = (
  mapStateToProps: MapStateToProps,
) => (WrappedComponent: React$ComponentType<{}>) => React$ComponentType<{}>

export type CreateConnect = Consumer => Connect

export type SetProvider = any => any

type Provider = React$ComponentType<*>

export type CreateProvider = (
  setProvider: SetProvider,
  Provider: Provider,
  initialState: State,
) => React$ComponentType<*>

export type Subscription = (action: string, state: State, args: {}) => void

type Store = {
  Provider: Provider,
  connect: Connect,
  actions: Actions,
  subscribe: (subscription: Subscription) => void,
  unsubscribe: (subscription: Subscription) => void,
}

export type CreateStore = (config: Config, middlewares: Middleware[]) => Store

declare module 'react-waterfall' {
  declare export default CreateStore
}
