import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Globe from '../../containers/Globe/Globe';
import Space from '../../containers/Space/Space';
import Navigator from '../../containers/Navigator/Navigator';
import { CanvasProvider } from '../../helpers/Canvas';
import ResponsiveWrapper from '../../helpers/ResponsiveWrapper';
import './App.css';

class App extends PureComponent {
  componentDidMount() {
    this.props.fetchData();

    window.addEventListener('mousewheel', ({ deltaY }) => {
      deltaY < 0 ? this.props.zoomIn() : this.props.zoomOut();
    });
  }

  render() {
    const {
      projectionType, parentWidth, parentHeight, topoJSON,
    } = this.props;
    if (!topoJSON) return <div>loading...</div>;
    const dimensions = {
      width: Math.min(parentWidth, 900) || 900,
      height: Math.min(parentHeight, 900) || 900,
    };
    return (
      <div className={`map--${projectionType}`}>
        <Navigator />
        <CanvasProvider width={dimensions.width} height={dimensions.height}>
          <Space />
          <Globe />
        </CanvasProvider>
      </div>
    );
  }
}
App.defaultProps = {
  topoJSON: null,
};

App.propTypes = {
  parentWidth: PropTypes.number.isRequired,
  parentHeight: PropTypes.number.isRequired,
  projectionType: PropTypes.string.isRequired,
  topoJSON: PropTypes.oneOfType([
    PropTypes.objectOf(PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
      PropTypes.array,
    ])),
    PropTypes.any,
  ]),
  fetchData: PropTypes.func.isRequired,
  zoomIn: PropTypes.func.isRequired,
  zoomOut: PropTypes.func.isRequired,
};

export default ResponsiveWrapper(App);
