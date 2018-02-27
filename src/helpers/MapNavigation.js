import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { geoMercator, geoOrthographic } from 'd3-geo';
import { getTrackballRotation } from './Trackball';

export const MapNavigation = (EnchancedComponent) => {
  class MapNav extends PureComponent {
    componentDidMount() {
      this.rotationEase = 2;
      const { width, height } = this.props;
      this.bindEvents();
      this.setProjection(this.props);
      this.props.changePosition([width / 2, height / 2]);
    }

    componentWillUpdate(props) {
      this.setProjection(props);
      this.trackballRotation = getTrackballRotation(this.projection);
    }

    setProjection = (props) => {
      const {
        projectionType, scale, rotation, translate,
      } = props;
      this.projection = projectionType === 'orthographic' ? geoOrthographic() : geoMercator();
      this.projection.scale(scale)
        .translate(translate)
        .rotate(rotation);

      return this.projection;
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

    mouseMove = ({ x, y }) => {
      const { projectionType, translate } = this.props;
      const [translateX, translateY] = translate;

      if (projectionType === 'orthographic') {
        const originRotation = this.projection.rotate();
        const rotation = this.trackballRotation(
          originRotation,
          this.originCoords, [x / this.rotationEase, y / this.rotationEase],
        );
        this.props.changeRotation(rotation);
      } else {
        const [originX, originY] = this.originPosition;
        this.props.changePosition([translateX - (originX - x), translateY - (originY - y)]);
        this.originPosition = [x, y];
      }
    }

    render() {
      return (
        <EnchancedComponent
          {...this.props}
          projection={this.projection}
        />
      );
    }
  }

  MapNav.defaultProps = {
    translate: [0, 0],
    changePosition: () => { },
  };

  MapNav.propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    scale: PropTypes.number.isRequired,
    rotation: PropTypes.arrayOf(PropTypes.number).isRequired,
    translate: PropTypes.arrayOf(PropTypes.number),
    projectionType: PropTypes.string.isRequired,
    getCanvas: PropTypes.func.isRequired,
    changeRotation: PropTypes.func.isRequired,
    changePosition: PropTypes.func,
  };

  return MapNav;
};

export default MapNavigation;
