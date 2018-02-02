import React, { Component } from 'react';
import Globe from "../Globe/Globe";
import Space from "../Space/Space";
import { provideCanvas } from "../../helpers/Canvas";
import './App.css';

class App extends Component {
  render() {
    return (
      <div>
        <Globe />
        <Space />
      </div>
    );
  }
}

export default provideCanvas({ width: 500, height: 500 })(App);
