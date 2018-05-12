import { ComponentType } from 'react';

export type Action<T> = (...args: any[]) => void
export type Actions<T> = {
  [K: string]: Action<T>
}
export type Store<T, A> = {
  initialState: T
  actions: {
    [K in keyof A]: (state: T, ...args: any[]) => Partial<T> | Promise<Partial<T>>
  }
}

export type Subscriber<T, A> = (action: keyof A, state: T, ...args: any[]) => void

export type Middleware<T, A> = (store: Store<T, A>, self: ComponentType<any>) => (action: keyof A, ...args: any[]) => void

export type Connect<T, P = any> = (selector: (state: T) => P) => (baseComponet: ComponentType<any>) => ComponentType<any>

export function initStore<T, A extends Actions<T>>(store: Store<T, A>, ...middlewares: Middleware<T, A>[]): {
  Provider: ComponentType<any>
  Consumer: ComponentType<any>
  connect: Connect<T>
  actions: A
  getState: () => T
  subscribe: (subscruber: Subscriber<T, A>) => void
}
