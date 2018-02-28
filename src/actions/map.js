export const ROTATE = 'ROTATE';
export const TRANSLATE = 'TRANSLATE';
export const SCALE = 'SCALE';
export const ZOOM_IN = 'ZOOM_IN';
export const ZOOM_OUT = 'ZOOM_OUT';
export const PROJECTION_TYPE = 'PROJECTION_TYPE';
export const MAP_TYPE = 'MAP_TYPE';
export const RESET_PROJECTION = 'RESET_PROJECTION';

export const changeRotation = payload => ({
  type: ROTATE,
  payload,
});

export const changePosition = payload => ({
  type: TRANSLATE,
  payload,
});

export const changeScale = payload => ({
  type: SCALE,
  payload,
});

export const zoomIn = payload => ({
  type: ZOOM_IN,
  payload,
});

export const zoomOut = payload => ({
  type: ZOOM_OUT,
  payload,
});

export const changeProjection = payload => ({
  type: PROJECTION_TYPE,
  payload,
});

export const changeMapType = payload => ({
  type: MAP_TYPE,
  payload,
});

export const resetProjection = payload => ({
  type: RESET_PROJECTION,
  payload,
});
