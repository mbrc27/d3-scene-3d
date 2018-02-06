import { PureComponent } from 'react';
import { geoPath, geoAzimuthalEquidistant } from "d3-geo";
import { withCanvas } from "../../helpers/Canvas";

class Space extends PureComponent {
    constructor(props) {
        super(props);
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

        this.state = { stars };
    }

    componentDidMount() {
        const ctx = this.props.getCanvas().getContext("2d");
        this.setState(state => ({ ...state, ctx }));
    }

    componentWillUpdate(props, state) {
        const { scale, width, height, rotation } = props;
        const { ctx } = state;
        this.projection = geoAzimuthalEquidistant()
            .scale(scale)
            .translate([width / 2, height / 2])
            .rotate(rotation);

        this.path = geoPath()
            .projection(this.projection)
            .context(ctx);
    }

    render() {
        const { ctx, stars } = this.state;
        const { width, height } = this.props;

        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.save();

            ctx.fillStyle = "white";
            ctx.strokeStyle = "white";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.beginPath();
            stars.forEach((star) => {
                this.path.pointRadius(star.properties.radius);
                this.path(star);
            });
            ctx.fill();

            ctx.restore();
        }
        return null;
    }
}

export default withCanvas(Space);