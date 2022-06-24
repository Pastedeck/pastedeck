import React from "react";

export default class Slider extends React.Component {
  render() {
    return (
      <>
        <div className="sliderspacer"></div>
        <div className="slider">
          <div className="line"></div>
          <div className="subline inc"></div>
          <div className="subline dec"></div>
        </div>
      </>
    )
  }
};