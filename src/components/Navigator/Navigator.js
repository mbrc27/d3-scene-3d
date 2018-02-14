import React from 'react';
import "./Navigator.css";

const Navigator = ({ zoomIn, zoomOut, restore, changeMap }) => {
    return (
        <div className="navigator">
            <button className="navigator__btn" onClick={zoomIn}>+</button>
            <button className="navigator__btn" onClick={zoomOut}>-</button>
            <button className="navigator__btn" onClick={restore}>↩</button>
            <select className="navigator__select" onChange={changeMap}>
                <option value="choropleth">Choropleth map</option>
                <option value="bubble">Bubble map</option>
            </select>
        </div>
    );
};

export default Navigator;