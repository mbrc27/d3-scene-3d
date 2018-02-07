import { PureComponent } from 'react';
import { geoPath, geoOrthographic } from "d3-geo";
import { withCanvas } from "../../helpers/Canvas";
import { getTrackballRotation } from "../../helpers/Trackball";
import { getPowerUsageScale, sortCountriesByPercentage } from "../../helpers/PowerUsageScale";
import 'inset.js';

class Globe extends PureComponent {
    constructor(props) {
        super(props);
        this.state = { ctx: null };
        this.rotationEase = 2;
        this.globe = { type: "Sphere" };
        this.powerUsageColorScale = getPowerUsageScale(props.topoJSON.features);
        this.sortedCountries = sortCountriesByPercentage(props.topoJSON.features);

        this.mouseMove = this.mouseMove.bind(this);
    }
    componentDidMount() {
        const canvas = this.props.getCanvas();
        const ctx = canvas.getContext("2d");
        this.bindEvents();
        this.setState(state => ({ ...state, ctx }));
    }

    bindEvents(unbind = false) {
        const canvas = this.props.getCanvas();

        const mouseDown = ({ clientX, clientY }) => {
            this.originCoords = [clientX / this.rotationEase, clientY / this.rotationEase];
            canvas.addEventListener("mousemove", this.mouseMove);
        }

        const mouseUp = () => {
            this.originCoords = [0, 0];
            canvas.removeEventListener("mousemove", this.mouseMove);
        }
        if (!unbind) {
            canvas.addEventListener("mousedown", mouseDown);
            canvas.addEventListener("mouseup", mouseUp);
        } else {
            canvas.removeEventListener("mousedown", mouseDown);
            canvas.removeEventListener("mouseup", mouseUp);
        }
    }

    mouseMove(evt) {
        const { clientX, clientY } = evt;
        const originRotation = this.projection.rotate();
        const rotation = this.trackballRotation(originRotation, this.originCoords, [clientX / this.rotationEase, clientY / this.rotationEase]);

        this.props.rotate(rotation);
    }

    componentWillUnmount() {
        this.bindEvents(true);
    }

    componentWillUpdate(props, state) {
        const { scale, width, height, rotation } = props;
        const { ctx } = state;
        this.projection = geoOrthographic()
            .scale(scale)
            .translate([width / 2, height / 2])
            .rotate(rotation);


        this.path = geoPath()
            .projection(this.projection)
            .context(ctx);

        this.trackballRotation = getTrackballRotation(this.projection);
    }

    render() {
        const { topoJSON } = this.props;
        const { ctx } = this.state;

        if (ctx) {
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

            ctx.shadowInset = false;
            ctx.shadowBlur = 0;

            Object.entries(this.sortedCountries).forEach(([key, countries]) => {
                ctx.beginPath();
                ctx.fillStyle = this.powerUsageColorScale(+key);
                countries.forEach(c => this.path(c));
                ctx.fill();

            });


            ctx.strokeStyle = "#c1c1c1";
            ctx.lineWidth = .25;
            ctx.beginPath();
            this.path(topoJSON);
            ctx.stroke();

            ctx.restore();
        }

        return null;
    }
}

export default withCanvas(Globe);