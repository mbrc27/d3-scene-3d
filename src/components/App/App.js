import React, { PureComponent } from 'react';
import Globe from "../Globe/Globe";
import Space from "../Space/Space";
import Navigator from "../Navigator/Navigator";
import { CanvasProvider } from "../../helpers/Canvas";
import { getCountriesGeom } from "../../api/geodata";
import './App.css';

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { data: null, scale: 200, rotation: [0, 0] };
    this.zoomIn = this.zoom.bind(this, true);
    this.zoomOut = this.zoom.bind(this, false);
    this.changeRotation = this.changeRotation.bind(this);
    this.restore = this.changeRotation.bind(this, [0, 0]);
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

  changeRotation(rotation) {
    this.setState(state => ({ ...state, rotation }));
  }

  render() {
    const { data, scale, rotation } = this.state;
    if (!data) return <div>loading...</div>;
    const height = 900;
    const width = 900;
    return (
      <div>
        <Navigator zoomIn={this.zoomIn} zoomOut={this.zoomOut} restore={this.restore} />
        <CanvasProvider width={width} height={height}>
          <Space scale={scale} rotation={rotation} />
          <Globe scale={scale} topoJSON={data} rotation={rotation} rotate={this.changeRotation} />
        </CanvasProvider>
      </div>
    );
  }
}

export default App;
