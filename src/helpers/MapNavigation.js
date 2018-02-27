import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { geoMercator, geoOrthographic } from 'd3-geo';
import { getTrackballRotation } from './Trackball';

export const MapNavigation = (EnchancedComponent) => {
  class MapNav extends PureComponent {
    constructor(props) {
      super(props);
      const { rotation, projectionType, scale } = props;
      this.rotationEase = 2;

      this.state = {
        translateX: 0,
        translateY: 0,
        rotation,
      };
      this.projection = projectionType === 'orthographic' ? geoOrthographic() : geoMercator();

      this.projection.scale(scale)
        .translate([0, 0])
        .rotate(rotation);

      this.bindEvents = this.bindEvents.bind(this);
      this.mouseMove = this.mouseMove.bind(this);
    }
    componentDidMount() {
      this.bindEvents();
    }

    componentWillReceiveProps(nextProps) {
      const { width, height, rotation } = nextProps;
      let { state: newState } = this.state;
      if (rotation !== this.state.rotation) {
        newState = { ...newState, rotation: nextProps.rotation };
      }
      this.setState(state => ({
        ...state,
        ...newState,
        translateX: width / 2,
        translateY: height / 2,
      }));
    }


    componentWillUpdate(props, state) {
      const { scale, projectionType } = props;
      const { translateX, translateY, rotation } = state;
      this.projection = projectionType === 'orthographic' ? geoOrthographic() : geoMercator();

      this.projection.scale(scale)
        .translate([translateX, translateY])
        .rotate(rotation);

      this.trackballRotation = getTrackballRotation(this.projection);
    }

    bindEvents() {
      const canvas = this.props.getCanvas();

      canvas.addEventListener('mousedown', ({ x, y }) => {
        this.originPosition = [x, y];
        this.originCoords = [x / this.rotationEase, y / this.rotationEase];

        canvas.addEventListener('mousemove', this.mouseMove);
      });
      canvas.addEventListener('mouseup', () => {
        canvas.removeEventListener('mousemove', this.mouseMove);
      });
    }

    mouseMove({ x, y }) {
      const { translateX, translateY } = this.state;
      const { projectionType } = this.props;
      if (projectionType === 'orthographic') {
        const originRotation = this.projection.rotate();
        const rotation = this.trackballRotation(
          originRotation,
          this.originCoords, [x / this.rotationEase, y / this.rotationEase],
        );

        this.setState(state => ({
          ...state,
          rotation,
        }), this.props.setRotation(rotation));
      } else {
        const [originX, originY] = this.originPosition;
        this.setState(state => ({
          ...state,
          translateX: translateX - (originX - x),
          translateY: translateY - (originY - y),
        }));
        this.originPosition = [x, y];
      }
    }

    render() {
      const { translateX, translateY, rotation } = this.state;
      return (
        <EnchancedComponent
          {...this.props}
          translateX={translateX}
          translateY={translateY}
          rotation={rotation}
          projection={this.projection}
        />
      );
    }
  }

  MapNav.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
    projectionType: PropTypes.string.isRequired,
    getCanvas: PropTypes.func.isRequired,
    setRotation: PropTypes.func.isRequired,
  };

  return MapNav;
};

export default MapNavigation;
