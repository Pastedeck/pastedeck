import React from "react";

export default function Slider({ loading }) {
  return (
    <>
      <div className="sliderspacer" style={ loading ? { display: "none"}:{ display: "block" } }></div>
      <div className="slider" style={ loading ? { display: "block"}:{ display: "none" } }>
        <div className="line"></div>
        <div className="subline inc"></div>
        <div className="subline dec"></div>
      </div>
    </>
  )
};