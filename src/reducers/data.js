import { FETCHED_DATA } from '../actions/data';

const initialState = null;
export default (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCHED_DATA:
      return { ...state, ...payload };
    default:
      return state;
  }
};
