import React, { PureComponent } from 'react';

export default EnchancedComponent => (
  class ResponsiveWrapper extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        containerWidth: null,
      };

      this.fitParentContainer = this.fitParentContainer.bind(this);
    }

    componentDidMount() {
      this.fitParentContainer();
      window.addEventListener('resize', this.fitParentContainer);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.fitParentContainer);
    }

    fitParentContainer() {
      const { containerWidth } = this.state;

      const currentContainerWidth = window.innerWidth;
      const currentContainerHeight = window.innerHeight;

      if (containerWidth !== currentContainerWidth) {
        this.setState(state => ({
          ...state,
          containerWidth: currentContainerWidth,
          containerHeight: currentContainerHeight,
        }));
      }
    }

    render() {
      const { containerWidth, containerHeight } = this.state;
      const shouldRenderChart = containerWidth !== null;
      return (
        <div
          ref={(el) => { this.chartContainer = el; }}
          className="Responsive-wrapper"
        >
          {shouldRenderChart && <EnchancedComponent
            {...this.props}
            parentWidth={containerWidth}
            parentHeight={containerHeight}
          />}
        </div>
      );
    }
  }
);
