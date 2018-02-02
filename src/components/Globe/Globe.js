import React, { Component } from 'react';
import { withCanvas } from "../../helpers/Canvas";

class Globe extends Component {
    componentDidMount() {
        const ctx = this.props.getCanvas().getContext("2d");
        console.log(ctx);
    }
    render() {
        return (
            <div>
                Globe
            </div>
        );
    }
}

export default withCanvas(Globe);