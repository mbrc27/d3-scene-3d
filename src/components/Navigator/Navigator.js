import React from 'react';
import PropTypes from 'prop-types';
import './Navigator.css';

const Navigator = ({
  projectionType, mapType, zoomIn, zoomOut, restoreRotation, changeMapType, changeProjection,
}) => (
  <div className="navigator">
    <button className="navigator__btn" onClick={zoomIn}>+</button>
    <button className="navigator__btn" onClick={zoomOut}>-</button>
    <button className="navigator__btn" onClick={restoreRotation}>↩</button>
    <select className="navigator__select" value={mapType} onChange={changeMapType}>
      <option value="choropleth">Choropleth map</option>
      <option value="bubble">Bubble map</option>
    </select>
    <select className="navigator__select" value={projectionType} onChange={changeProjection}>
      <option value="orthographic">Orthographic</option>
      <option value="mercator">Mercator</option>
    </select>
  </div>
);

Navigator.propTypes = {
  projectionType: PropTypes.string.isRequired,
  mapType: PropTypes.string.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  restoreRotation: PropTypes.func.isRequired,
  changeMapType: PropTypes.func.isRequired,
  changeProjection: PropTypes.func.isRequired,
};

export default Navigator;
