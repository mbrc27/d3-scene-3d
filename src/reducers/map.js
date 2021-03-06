import {
  ROTATE,
  TRANSLATE,
  PROJECTION_TYPE,
  MAP_TYPE,
  ZOOM_IN,
  ZOOM_OUT,
  RESET_PROJECTION,
} from '../actions/map';
import { checkHashParam } from '../helpers/utils';

const [mapType = 'choropleth', projectionType = 'orthographic'] = checkHashParam();
const initialState = {
  rotation: [0, 0],
  projectionType,
  mapType,
  scale: 200,
  translate: [0, 0],
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case ROTATE:
      return { ...state, rotation: payload };
    case TRANSLATE:
      return { ...state, translate: payload };
    case PROJECTION_TYPE:
      return { ...state, projectionType: payload };
    case MAP_TYPE:
      return { ...state, mapType: payload };
    case ZOOM_IN:
      return { ...state, scale: state.scale + 100 };
    case ZOOM_OUT:
      return { ...state, scale: state.scale - 100 };
    case RESET_PROJECTION:
      return { ...state, rotation: [0,0], translate: payload };
    default:
      return state;
  }
};
