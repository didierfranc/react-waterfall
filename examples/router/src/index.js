import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-waterfall';
import { Route, Router, Switch } from 'react-router';
import { createHashHistory } from 'history';

import store from './store';
import './index.css';
import App from './components/App';

const ConnectedRoute = ({ context, component: Component, ...props }) => (
  <Route {...props} render={(matchProps) => (<Component {...matchProps} context={context} />)} />
);

ReactDOM.render((
    <Router history={createHashHistory()}>
      <Switch>
        <Provider store={store}>
          <ConnectedRoute path="/" exact component={App} />
          <ConnectedRoute path="/:user" exact component={App} />
        </Provider>
      </Switch>
    </Router>
  ), document.getElementById('root'),
);
