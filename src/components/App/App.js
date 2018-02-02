import React, { Component } from 'react';
import Globe from "../Globe/Globe";
import Space from "../Space/Space";
import { provideCanvas } from "../../helpers/Canvas";
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
        this.setState({ ...this.state, data });
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
      <div>
        <Globe width={500} height={500} scale={150} topoJSON={data}/>
        <Space width={500} height={500} scale={150}/>
      </div>
    );
  }
}

export default provideCanvas({ width: 500, height: 500 })(App);
