import React, { PureComponent } from 'react';
import { geoMercator, geoOrthographic } from "d3-geo";
import { getTrackballRotation } from "./Trackball";

export const MapNavigation = EnchancedComponent => (
    class MapNavigation extends PureComponent {
        constructor(props) {
            super(props);
            this.rotationEase = 2;

            this.state = {
                translateX: 0,
                translateY: 0,
                rotation: [0, 0]
            };
            this.bindEvents = this.bindEvents.bind(this);
            this.mouseMove = this.mouseMove.bind(this);
        }
        componentDidMount() {
            const { width, height } = this.props;

            this.setState(state => ({
                ...state,
                translateX: width / 2,
                translateY: height / 2
            }))
            this.bindEvents();
        }
        componentWillReceiveProps


        componentWillReceiveProps(nextProps) {
            if (nextProps.rotation !== this.props.rotation) {
                this.setState(state => ({ ...state, rotation: nextProps.rotation }));
            }
        }

        componentWillUpdate(props, state) {
            const { scale, rotation, projectionType } = props;
            const { translateX, translateY } = state;
            this.projection = projectionType === "orthographic" ? geoOrthographic() : geoMercator();

            this.projection.scale(scale)
                .translate([translateX, translateY])
                .rotate(rotation);

            this.trackballRotation = getTrackballRotation(this.projection);

        }

        bindEvents() {
            const canvas = this.props.getCanvas();



            canvas.addEventListener("mousedown", ({ x, y }) => {
                this.originPosition = [x, y];
                this.originCoords = [x / this.rotationEase, y / this.rotationEase];

                canvas.addEventListener("mousemove", this.mouseMove);
            });
            canvas.addEventListener("mouseup", () => {
                canvas.removeEventListener("mousemove", this.mouseMove);
            });
        }

        mouseMove({ x, y }) {
            const { translateX, translateY } = this.state;
            const { projectionType } = this.props;
            if (projectionType === "orthographic") {
                const originRotation = this.projection.rotate();
                const rotation = this.trackballRotation(originRotation,
                    this.originCoords, [x / this.rotationEase, y / this.rotationEase]);

                this.setState(state => ({
                    ...state,
                    rotation
                }));
            } else {
                const [originX, originY] = this.originPosition;
                this.setState(state => ({
                    ...state,
                    translateX: translateX - (originX - x),
                    translateY: translateY - (originY - y)
                }));
                this.originPosition = [x, y];
            }
        }

        render() {
            const { translateX, translateY, rotation } = this.state;
            return (
                <EnchancedComponent
                    {...this.props}
                    translateX={translateX}
                    translateY={translateY}
                    rotation={rotation}
                    projection={this.projection}
                />
            );
        }
    }
);