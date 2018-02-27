import React, { PureComponent } from 'react';
import Globe from "../Globe/Globe";
import Space from "../Space/Space";
import Navigator from "../Navigator/Navigator";
import { CanvasProvider } from "../../helpers/Canvas";
import ResponsiveWrapper from "../../helpers/ResponsiveWrapper";
import { getCountriesGeom } from "../../api/geodata";
import './App.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    const [type = "choropleth", projectionType = "orthographic"] = this.checkHashParam();
    this.state = {
      data: null,
      scale: 200,
      rotation: [0, 0],
      type,
      projectionType
    };
    this.zoomIn = this.zoom.bind(this, true);
    this.zoomOut = this.zoom.bind(this, false);
    this.restore = this.changeRotation.bind(this, [0, 0]);
    this.changeRotation = this.changeRotation.bind(this);
    this.changeMapType = this.changeMapType.bind(this);
    this.changeMapProjection = this.changeMapProjection.bind(this);
  }

  componentDidMount() {
    getCountriesGeom()
      .then((data) => {
        this.setState(state => ({ ...state, data }));
      })
      .catch((error) => {
        this.setState(state => {
          throw new Error(error);
        });
      });

    window.addEventListener("mousewheel", ({ deltaY }) => {
      const zoomIn = deltaY < 0;
      this.zoom(zoomIn);
    })
  }

  zoom(zoomIn = false) {
    const scaleAdjust = 100;
    this.setState(state => ({
      ...state, scale: zoomIn ?
        state.scale + scaleAdjust :
        Math.max(state.scale - scaleAdjust, 200)
    }))
  }

  checkHashParam() {
    const { hash } = window.location;

    return hash ? hash.replace("#", "").split("/") : "";
  }

  changeRotation(rotation) {
    this.setState(state => ({ ...state, rotation }));
  }

  changeMapType({ target }) {
    const { value: type } = target;
    this.setState(state => ({ ...state, type }));
  }
  changeMapProjection({ target }) {
    const { value: projectionType } = target;
    this.setState(state => ({ ...state, projectionType }));
  }

  render() {
    const { data, scale, rotation, type, projectionType } = this.state;
    if (!data) return <div>loading...</div>;
    const { parentWidth, parentHeight } = this.props;
    const dimensions = {
      width: Math.min(parentWidth, 900) || 900,
      height: Math.min(parentHeight, 900) || 900
  };
    return (
      <div className={`map--${projectionType}`}>
        <Navigator
          zoomIn={this.zoomIn}
          zoomOut={this.zoomOut}
          restore={this.restore}
          changeMap={this.changeMapType}
          changeProjection={this.changeMapProjection}
        />
        <CanvasProvider width={dimensions.width} height={dimensions.height}>
          <Space scale={scale} rotation={rotation} projectionType={projectionType} mapType={type} />
          <Globe
            scale={scale}
            topoJSON={data}
            rotation={rotation}
            mapType={type}
            projectionType={projectionType}
            setRotation={this.changeRotation}
          />
        </CanvasProvider>
      </div>
    );
  }
}

export default ResponsiveWrapper(App);
