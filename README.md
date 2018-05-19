# react-waterfall

React store built on top of [the new context API](https://reactjs.org/docs/context.html)

## Basics

**store.js**
```js
import createStore from 'react-waterfall'

const config = {
  initialState: { count: 0 },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
  },
}

export const { Provider, connect, actions } = createStore(config)
```

**App.js**
```js
import { connect, Provider, actions } from './store'

let Count = ({ count }) => count
Count = connect(({ count }) => ({ count }))(Count)

const App = () => (
  <Provider>
    <Count />
    <button onClick={actions.increment})>+</button>
  </Provider>
)
```

## Devtools

It's possible to use `redux-devtools` with `react-waterfall` thanks to this [middleware](https://github.com/elisherer/react-waterfall-redux-devtools-middleware)

**store.js**
```js
import createStore from 'react-waterfall'
import reduxDevTools from 'react-waterfall-redux-devtools-middleware'

const config = ...
const middlewares = __DEV__ ? [reduxDevTools] : []

export const { Provider, connect, actions } = createStore(config, middlewares)
```

## Contributors

https://github.com/didierfranc/react-waterfall/graphs/contributors

## Links

* https://twitter.com/DidierFranc/status/965733433711489024
* https://medium.com/@DidierFranc/replacing-redux-with-the-new-react-context-api-8f5d01a00e8c