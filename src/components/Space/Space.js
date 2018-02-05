import { PureComponent } from 'react';
import { scaleLinear } from 'd3-scale';
import { randomUniform } from 'd3-random';
import { withCanvas } from "../../helpers/Canvas";

class Space extends PureComponent {
    constructor(props) {
        super(props);
        const { width, height } = props;
        const xScale = scaleLinear()
            .range([0, width])
            .domain([0, 100]);

        const yScale = scaleLinear()
            .range([height, 0])
            .domain([0, 100]);

        const randomFunc = randomUniform(0, 100);

        // We're creating random distribution of stars dataset
        const stars = new Array(200).fill(0).map(() => ({
            x: xScale(randomFunc()),
            y: yScale(randomFunc()),
        }));

        this.state = { stars };
    }

    componentDidMount() {
        const ctx = this.props.getCanvas().getContext("2d");
        this.setState(state => ({ ...state, ctx }));
    }

    render() {
        const { ctx, stars } = this.state;
        const { width, height } = this.props;

        if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.save();

            ctx.fillStyle = "white";
            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            stars.forEach(({ x, y }) => ctx.fillRect(x, y, 1.5, 1.5));

            ctx.restore();
        }
        return null;
    }
}

export default withCanvas(Space);