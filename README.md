# react-waterfall

React store built on top of [the new context API](https://reactjs.org/docs/context.html)

## Basics

**store.js**
```js
import createStore from 'react-waterfall'

const config = {
  initialState: { count: 0 },
  actionsCreators: {
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

During development `redux-devtools` are automatically enabled. Install the [extension](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd).

## Contributors

https://github.com/didierfranc/react-waterfall/graphs/contributors

## Links

* https://twitter.com/DidierFranc/status/965733433711489024
* https://medium.com/@DidierFranc/replacing-redux-with-the-new-react-context-api-8f5d01a00e8c