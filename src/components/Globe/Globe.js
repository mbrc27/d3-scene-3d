import { Component } from 'react';
import { geoPath, geoOrthographic } from "d3-geo";
import { withCanvas } from "../../helpers/Canvas";

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
        const {topoJSON } = this.props;
        const { ctx } = this.state;

        if (ctx) {
            ctx.fillStyle = "#00006B";
            ctx.beginPath();
            this.path(this.globe);
            ctx.fill();

            ctx.fillStyle = "#29527A";
            ctx.beginPath();
            this.path(topoJSON);
            ctx.fill();


            ctx.strokeStyle = "#fff";
            ctx.lineWidth = .5;
            ctx.beginPath();
            this.path(topoJSON);
            ctx.stroke();
        }

        return null;
    }
}

export default withCanvas(Globe);