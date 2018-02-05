import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

export const withCanvas = EnchancedComponent => {
    const Canvas = (props, context) => (
        <EnchancedComponent
            {...props}
            getCanvas={context.getCanvas}
            width={context.width}
            height={context.height}
        />
    );

    Canvas.contextTypes = {
        getCanvas: PropTypes.func,
        width: PropTypes.number,
        height: PropTypes.number
    };

    return Canvas;
};

export class CanvasProvider extends Component {
    constructor(props) {
        super(props);
        this.getCanvas = this.getCanvas.bind(this);
    }
    getChildContext() {
        const { width, height } = this.props;
        return { getCanvas: this.getCanvas, width, height };
    }
    getCanvas() {
        return this.canvas;
    }

    render() {
        const { width, height } = this.props;
        return (
            <Fragment>
                <canvas ref={(canvas) => this.canvas = canvas} width={width} height={height} />
                {this.props.children}
            </Fragment >
        );
    }
}

CanvasProvider.childContextTypes = {
    getCanvas: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number
};