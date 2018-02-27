import 'inset.js';
import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { geoPath, geoCentroid } from 'd3-geo';
import { withCanvas } from '../../helpers/Canvas';
import { MapNavigation } from '../../helpers/MapNavigation';
import { getPowerUsageScale, sortCountriesByPercentage } from '../../helpers/PowerUsageScale';

class Globe extends PureComponent {
  constructor(props) {
    super(props);
    const { topoJSON } = props;
    this.state = { ctx: null };
    this.globe = { type: 'Sphere' };
    this.powerUsageColorScale = getPowerUsageScale(topoJSON.features);
    this.sortedCountries = sortCountriesByPercentage(topoJSON.features);
  }

  componentDidMount() {
    const canvas = this.props.getCanvas();
    const ctx = canvas.getContext('2d');
    this.setState(state => ({ ...state, ctx }));
  }

  componentWillUpdate(props, state) {
    const { projection } = props;
    const { ctx } = state;

    this.path = geoPath()
      .projection(projection)
      .context(ctx);
  }

  render() {
    const { ctx } = this.state;
    const {
      topoJSON, mapType, projectionType, width, height, scale,
    } = this.props;

    if (ctx) {
      if (projectionType === 'mercator') ctx.clearRect(0, 0, width, height);
      ctx.save();
      if (projectionType !== 'mercator') {
        ctx.fillStyle = '#053367';
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'white';
        ctx.beginPath();
        this.path(this.globe);
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.fillStyle = '#053367';
        ctx.shadowInset = true;
        ctx.shadowBlur = 95;
        ctx.shadowColor = 'black';
        ctx.beginPath();
        this.path(this.globe);
        ctx.fill();
      }

      if (mapType === 'choropleth') {
        ctx.shadowBlur = 0;
        ctx.shadowInset = false;
        Object.entries(this.sortedCountries).forEach(([key, countries]) => {
          ctx.beginPath();
          ctx.fillStyle = this.powerUsageColorScale(+key);
          countries.forEach(c => this.path(c));
          ctx.fill();
        });
      } else {
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#8aaa63';
        ctx.beginPath();
        this.path(topoJSON);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.shadowInset = false;
        ctx.globalAlpha = 0.7;

        Object.entries(this.sortedCountries).forEach(([key, countries]) => {
          const countriesCentroids = countries.map(country => ({
            ...country,
            geometry: {
              type: 'Point',
              coordinates: geoCentroid(country),
            },
          }));
          ctx.beginPath();
          ctx.fillStyle = this.powerUsageColorScale(+key);
          this.path.pointRadius(+key * 0.25 || 2.5);
          countriesCentroids.forEach(c => this.path(c));
          ctx.fill();
        });

        ctx.globalAlpha = 1;
      }

      ctx.strokeStyle = '#c1c1c1';
      ctx.lineWidth = 0.25;
      ctx.beginPath();
      this.path(topoJSON);
      ctx.stroke();

      if (scale > 300) {
        ctx.fillStyle = 'black';
        ctx.font = '10px Arial';
        topoJSON.features.forEach((feature) => {
          const [x, y] = this.path.centroid(feature);
          const { name, powerUsage } = feature.properties;
          ctx.fillText(name || '', x, y);
          ctx.fillText(Math.round(powerUsage * 100) / 100 || '', x, y + 20);
        });
      }

      ctx.restore();
    }

    return null;
  }
}

Globe.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  mapType: PropTypes.string.isRequired,
  projectionType: PropTypes.string.isRequired,
  getCanvas: PropTypes.func.isRequired,
  topoJSON: PropTypes.objectOf(PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
    PropTypes.array,
  ])).isRequired,
};

export default withCanvas(MapNavigation(Globe));
