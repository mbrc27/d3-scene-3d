import { combineReducers } from 'redux';
import map from './map';
import data from './data';

const rootReducer = combineReducers({
  map,
  data,
});

export default rootReducer;
