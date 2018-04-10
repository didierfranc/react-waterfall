[![Coverage Status](https://coveralls.io/repos/github/didierfranc/react-waterfall/badge.svg)](https://coveralls.io/github/didierfranc/react-waterfall)

# react-waterfall

## How to use it ?

```sh
yarn add react-waterfall
```

Here is an example of a basic implementation.

```js
import { initStore } from 'react-waterfall'

const store = {
  initialState: { count: 0 },
  actions: {
    increment: ({ count }) => ({ count: count + 1 }),
  },
}

const { Provider, connect } = initStore(store)

let Count = ({ count, actions }) => (
  <>
    {count}
    <button onClick={actions.increment}>+</button>
  </>
)

Count = connect(state => ({ count: state.count }))(Count)

const App = () => (
  <Provider>
    <Count />
  </Provider>
)
```

You will find more examples [here](https://github.com/didierfranc/react-waterfall/tree/master/examples).

# Redux DevTools

If you want you can use Redux DevTools with `react-waterfall` thanks to [this middleware](https://github.com/elisherer/react-waterfall-redux-devtools-middleware).

```js
import { initStore } from 'react-waterfall'
import devtools from 'react-waterfall-redux-devtools-middleware'

const prod = process.env.NODE_ENV === 'production'

export const { Provider, connect } = initStore(store, !prod && devtools())
```

## Types

You can explore types [here](dist/react-waterfall.js.flow)

## Advanced

Advanced examples are available [here](https://github.com/didierfranc/react-waterfall-example)

## Links

* https://twitter.com/DidierFranc/status/965733433711489024
* https://medium.com/@DidierFranc/replacing-redux-with-the-new-react-context-api-8f5d01a00e8c
