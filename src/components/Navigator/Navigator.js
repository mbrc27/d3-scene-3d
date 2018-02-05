import React from 'react';
import "./Navigator.css";

const Navigator = ({ zoomIn, zoomOut, restore }) => {
    return (
        <div className="navigator">
            <button className="navigator__btn" onClick={zoomIn}>+</button>
            <button className="navigator__btn" onClick={zoomOut}>-</button>
            <button className="navigator__btn" onClick={restore}>↩</button>
        </div>
    );
};

export default Navigator;