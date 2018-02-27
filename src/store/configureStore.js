import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { createLogger } from 'redux-logger';
import rootReducer from '../reducers';

/* eslint-disable no-underscore-dangle */

const configureStore = (state) => {
  let middleware;
  if (process.env.NODE_ENV === 'production') {
    middleware = applyMiddleware(thunk);
  } else {
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    middleware = composeEnhancers(applyMiddleware(thunk, createLogger()));
  }
  const store = createStore(
    rootReducer,
    state,
    middleware,
  );
  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('../reducers', () => {
        // eslint-disable-next-line global-require
        const nextRootReducer = require('../reducers').default;
        store.replaceReducer(nextRootReducer);
      });
    }
  }
  return store;
};

export default configureStore;
