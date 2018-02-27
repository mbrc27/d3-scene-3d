import React from 'react';
import PropTypes from 'prop-types';
import './Navigator.css';

const Navigator = ({
  zoomIn, zoomOut, restore, changeMap, changeProjection,
}) => (
  <div className="navigator">
    <button className="navigator__btn" onClick={zoomIn}>+</button>
    <button className="navigator__btn" onClick={zoomOut}>-</button>
    <button className="navigator__btn" onClick={restore}>↩</button>
    <select className="navigator__select" onChange={changeMap}>
      <option value="choropleth">Choropleth map</option>
      <option value="bubble">Bubble map</option>
    </select>
    <select className="navigator__select" onChange={changeProjection}>
      <option value="orthographic">Orthographic</option>
      <option value="mercator">Mercator</option>
    </select>
  </div>
);

Navigator.propTypes = {
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
  restore: PropTypes.func.isRequired,
  changeMap: PropTypes.func.isRequired,
  changeProjection: PropTypes.func.isRequired,
};

export default Navigator;
