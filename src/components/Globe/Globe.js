import { Component } from 'react';
import { geoPath, geoOrthographic } from "d3-geo";
import { withCanvas } from "../../helpers/Canvas";
import 'inset.js';

class Globe extends Component {
    constructor(props) {
        super(props);
        this.state = { ctx: null, };
        this.globe = { type: "Sphere" };
    }
    componentDidMount() {
        const ctx = this.props.getCanvas().getContext("2d");
        this.setState(state => ({ ...state, ctx }));
    }

    componentWillUpdate(props, state) {
        const { scale, width, height } = props;
        const { ctx } = state;
        const projection = geoOrthographic()
            .scale(scale)
            .translate([width / 2, height / 2])
            .rotate([0, 0])
            .clipAngle(90);

        this.path = geoPath()
            .projection(projection)
            .context(ctx);
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

            ctx.shadowBlur = 10;
            ctx.fillStyle = "#409440";
            ctx.beginPath();
            this.path(topoJSON);
            ctx.fill();

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