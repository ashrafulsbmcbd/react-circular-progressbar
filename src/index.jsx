import React from 'react';
import PropTypes from 'prop-types';

const MIN_PERCENTAGE = 0;
const MAX_PERCENTAGE = 100;
const BACKGROUND_OFFSET = 7;

class CircularProgressbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      percentage: props.initialAnimation ? 0 : props.percentage,
    };
  }

  componentDidMount() {
    if (this.props.initialAnimation) {
      this.initialTimeout = setTimeout(() => {
        this.requestAnimationFrame = window.requestAnimationFrame(() => {
          this.setState({
            percentage: this.props.percentage,
          });
        });
      }, 0);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      percentage: nextProps.percentage,
    });
  }

  componentWillUnmount() {
    clearTimeout(this.initialTimeout);
    window.cancelAnimationFrame(this.requestAnimationFrame);
  }

  getPathDescription() {
    const radius = this.getPathRadius();
    return `
      M 50,50 m 0,-${radius}
      a ${radius},${radius} 0 1 1 0,${2 * radius}
      a ${radius},${radius} 0 1 1 0,-${2 * radius}
    `;
  }

  getProgressStyle() {
    const diameter = Math.PI * 2 * this.getPathRadius();
    const truncatedPercentage = Math.min(Math.max(this.state.percentage, MIN_PERCENTAGE), MAX_PERCENTAGE);
    return {
      strokeDasharray: `${diameter}px ${diameter}px`,
      strokeDashoffset: `${((100 - truncatedPercentage) / 100 * diameter)}px`,
    };
  }

  getPathRadius() {
    // the radius of the path is defined to be in the middle, so in order for the path to
    // fit perfectly inside the 100x100 viewBox, need to subtract half the strokeWidth
    return 50 - (this.props.strokeWidth / 2) - this.props.backgroundGutter;
  }

  render() {
    const classForPercentage = this.props.classForPercentage ? this.props.classForPercentage(this.props.percentage) : '';
    const pathDescription = this.getPathDescription();

    return (
      <svg
        className={`CircularProgressbar ${this.props.className} ${classForPercentage}`}
        viewBox="0 0 100 100"
      >
        <circle
          className="CircularProgressbar-background"
          cx={50}
          cy={50}
          r={50}
        />

        <path
          className="CircularProgressbar-trail"
          d={pathDescription}
          strokeWidth={this.props.strokeWidth}
          fillOpacity={0}
        />

        <path
          className="CircularProgressbar-path"
          d={pathDescription}
          strokeWidth={this.props.strokeWidth}
          fillOpacity={0}
          style={this.getProgressStyle()}
        />

        <text
          className="CircularProgressbar-text"
          x={50}
          y={50}
        >
          {this.props.textForPercentage(this.props.percentage)}
        </text>
      </svg>
    );
  }
}

CircularProgressbar.propTypes = {
  percentage: PropTypes.number.isRequired,
  strokeWidth: PropTypes.number,
  className: PropTypes.string,
  backgroundGutter: PropTypes.number,
  initialAnimation: PropTypes.bool,
  classForPercentage: PropTypes.func,
  textForPercentage: PropTypes.func,
};

CircularProgressbar.defaultProps = {
  strokeWidth: 8,
  className: '',
  backgroundGutter: 0,
  initialAnimation: false,
  textForPercentage: (percentage) => `${percentage}%`,
};

export default CircularProgressbar;
