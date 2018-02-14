D3 Scene 3D
===

## Overview
This repo shows example of using D3 with an HTML5 Canvas API to create a simple 3D World map. Project is set within react ecosystem (for state management, since Canvas doesn't use an DOM representation) and to create additional navigation component.

## Installation
Source code is stored at a `develop` branch.
App is based on CRA so to install dependencies type:
```
yarn install
```
And to run application on port 3000:
```
yarn start
```

## Components

App uses very simple project structure (in order to achive maximum clarity, the state is management by a component state), with two additional helper methods:
- Canvas - CanvasProvider container and withCanvas HOC for a easy canvas contex management in visual components
- Trackball - Trakcball functions based on the [pattricksurry's](http://bl.ocks.org/patricksurry) [blocks example](http://bl.ocks.org/patricksurry/5721459) for rotating orthograpic globe.
### Space
Space data is generated using randomUniform function from d3-random module, it is scaled using geoAzimuthalEquidistant projection to an canvas dimesions:
```js
const { width, height } = props;
this.projection = geoAzimuthalEquidistant()
    .scale(scale)
    .translate([width / 2, height / 2])
    .rotate(rotation);

this.path = geoPath()
    .projection(this.projection)
    .context(ctx);

// We're creating random distribution of stars dataset
const stars = new Array(200).fill(0).map(() => ({
    geometry: {
        type: 'Point',
        coordinates: [Math.random() * 360 - 180, Math.random() * 180 - 90]
    },
    type: 'Feature',
    properties: {
        radius: Math.random() * 1.5
    }
}));
```
Space is drawn as a 1 pixel rectangle (with small blur):
```js
  ctx.clearRect(0, 0, width, height);
  ctx.save();

  ctx.fillStyle = "white";
  ctx.shadowBlur = 10;
  ctx.shadowColor = "white";
  stars.forEach(({ x, y }) => ctx.fillRect(x, y, 1.5, 1.5));

  ctx.restore();
```
### Globe
Globe is based on the world dataset containing countries boundaries (`world-110m.json` topojson file).
Once the data is fetched and canvas element is created the projection and path is created:
```js
  this.projection = geoOrthographic()
      .scale(scale)
      .translate([width / 2, height / 2])
      .rotate(rotation)
      .clipAngle(90);

  this.path = geoPath()
      .projection(this.projection)
      .context(ctx);
```

And the data is drawn using the canvas API (Additional small module [inset.js](https://github.com/patlillis/inset.js) is used for the insent shadow of the globe)
```js
ctx.save();

ctx.fillStyle = "#053367";
ctx.shadowBlur = 20;
ctx.shadowColor = "white";
ctx.beginPath();
this.path(this.globe);
ctx.fill();
ctx.shadowBlur = 0;

ctx.fillStyle = "#053367";
ctx.shadowInset = true;
ctx.shadowBlur = 95;
ctx.shadowColor = 'black';
ctx.beginPath();
this.path(this.globe);
ctx.fill();

ctx.shadowBlur = 10;
ctx.fillStyle = "#587c2e";
ctx.beginPath();
this.path(topoJSON);
ctx.fill();
ctx.shadowInset = false;

ctx.strokeStyle = "#c1c1c1";
ctx.lineWidth = .25;
ctx.beginPath();
this.path(topoJSON);
ctx.stroke();

ctx.restore();
```

Additional mouse event listeners are append to check mouse movement and recalculate the projection with appropriate rotation and redraw the globe.


### Navigation

Simple navigation component is provided to zoom in and out, and to reset the globe rotation. Additionally the scroll event is also appended to a zoom in/out functionality.