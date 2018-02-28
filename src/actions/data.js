import { getCountriesGeom } from '../api/geodata';

export const FETCHING_DATA = 'FETCHING_DATA';
export const FETCHED_DATA = 'FETCHED_DATA';
export const FETCH_FAILED = 'FETCH_FAILED';

export const fetchData = dispatch => () => {
  dispatch({ type: FETCHING_DATA });
  getCountriesGeom()
    .then(payload => dispatch({ type: FETCHED_DATA, payload }))
    .catch(payload => dispatch({ type: FETCH_FAILED, payload }));
};
