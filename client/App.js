import React from 'react';

import Router from './Router';
import ModalRoot from './ModalRoot';

class App extends React.Component {
  render() {
    return (
      <div>
        <Router />
        <ModalRoot />
      </div>
    );
  }
}

// Hot Reload logic
import { hot } from 'react-hot-loader';

if (module.hot) {
  // Enable Webpack hot module replacement for reducers
  module.hot.accept('./reducers', () => {
    const nextRootReducer = require('./reducers/index');
    finalCreateStore.replaceReducer(nextRootReducer);
  });
}

export default hot(module)(App);
