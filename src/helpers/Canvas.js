import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export const withCanvas = EnchancedComponent => {
    const Canvas = (props, context) => (
        <EnchancedComponent
            {...props}
            getCanvas={context.getCanvas}
        />
    );

    Canvas.contextTypes = {
        getCanvas: PropTypes.func
    };

    return Canvas;
};

export const provideCanvas = ({ width, height }) => EnchancedComponent => {
    class Canvas extends Component {
        constructor(props) {
            super(props);
            this.getCanvas = this.getCanvas.bind(this);
        }
        getChildContext() {
            return { getCanvas: this.getCanvas };
        }
        getCanvas() {
            return this.canvas;
        }

        render() {
            return (
                <Fragment>
                    <canvas ref={(canvas) => this.canvas = canvas} width={width} height={height} />
                    <EnchancedComponent />
                </Fragment >
            );
        }
    }

    Canvas.childContextTypes = {
        getCanvas: PropTypes.func
    };

    return Canvas;
}