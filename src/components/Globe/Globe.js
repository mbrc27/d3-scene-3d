import { PureComponent } from 'react';
import { geoPath, geoCentroid } from "d3-geo";
import { withCanvas } from "../../helpers/Canvas";
import { MapNavigation } from "../../helpers/MapNavigation";
import { getPowerUsageScale, sortCountriesByPercentage } from "../../helpers/PowerUsageScale";
import 'inset.js';

class Globe extends PureComponent {
    constructor(props) {
        super(props);
        const { width, height } = props;
        this.globe = { type: 'Sphere' };
        this.state = { ctx: null, translateX: width / 2, translateY: height / 2 };
        this.powerUsageColorScale = getPowerUsageScale(props.topoJSON.features);
        this.sortedCountries = sortCountriesByPercentage(props.topoJSON.features);
    }
    componentDidMount() {
        const canvas = this.props.getCanvas();
        const ctx = canvas.getContext("2d");
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
        const { topoJSON, mapType, projectionType, width, height, scale } = this.props;
        const { ctx } = this.state;

        if (ctx) {
            projectionType === "mercator" && ctx.clearRect(0, 0, width, height);
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


            if (mapType === "choropleth") {
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
                ctx.fillStyle = "#8aaa63";
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
                            coordinates: geoCentroid(country)
                        }
                    }));
                    ctx.beginPath();
                    ctx.fillStyle = this.powerUsageColorScale(+key);
                    this.path.pointRadius(+key * 0.25 || 2.5);
                    countriesCentroids.forEach(c => this.path(c));
                    ctx.fill();
                });

                ctx.globalAlpha = 1;
            }

            ctx.strokeStyle = "#c1c1c1";
            ctx.lineWidth = .25;
            ctx.beginPath();
            this.path(topoJSON);
            ctx.stroke();

            if (scale > 300) {
                ctx.fillStyle = "black";
                ctx.font = "10px Arial";
                topoJSON.features.forEach(feature => {
                    const [x, y] = this.path.centroid(feature);
                    const { name, powerUsage } = feature.properties;
                    ctx.fillText(name || "", x, y);
                    ctx.fillText(Math.round(powerUsage * 100) / 100 || "", x, y + 20);
                });
            }

            ctx.restore();
        }

        return null;
    }
}

export default withCanvas(MapNavigation(Globe));