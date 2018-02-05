import React, { Component } from 'react';
import Globe from "../Globe/Globe";
import Space from "../Space/Space";
import { CanvasProvider } from "../../helpers/Canvas";
import { getCountriesGeom } from "../../api/geodata";
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { data: null };
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
  }

  render() {
    const { data } = this.state;
    if (!data) return <div>loading...</div>;

    return (
      <CanvasProvider width={900} height={900}>
        <Space scale={200}/>
        <Globe scale={200} topoJSON={data}/>
      </CanvasProvider>
    );
  }
}

export default App;
