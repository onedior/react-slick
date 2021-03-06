"use strict";

import React from "react";
import classnames from "classnames";

var getDotCount = function(spec) {
  var dots;

  if (spec.infinite) {
    dots = Math.ceil(spec.slideCount / spec.slidesToScroll);
  } else {
    dots =
      Math.ceil((spec.slideCount - spec.slidesToShow) / spec.slidesToScroll) +
      1;
  }

  return dots;
};

var getNthDotAssociatedSlides = function(n, spec) {
  var nthDotAssociatedSlides = "";
  for (
    var i = spec.slidesToScroll * n;
    (i < spec.slideCount || spec.infinite) &&
    i < spec.slidesToScroll * n + spec.slidesToShow;
    i = i + 1
  ) {
    if (i >= spec.slideCount && spec.infinite) {
      var newIndex = i - spec.slideCount;
      nthDotAssociatedSlides += ` ${spec.name}-${newIndex}`;
    } else {
      nthDotAssociatedSlides += ` ${spec.name}-${i}`;
    }
  }

  return nthDotAssociatedSlides.trim();
};

export class Dots extends React.PureComponent {
  clickHandler(options, e) {
    // In Autoplay the focus stays on clicked button even after transition
    // to next slide. That only goes away by click somewhere outside
    e.preventDefault();
    this.props.clickHandler(options);
  }
  render() {
    var dotCount = getDotCount({
      slideCount: this.props.slideCount,
      slidesToScroll: this.props.slidesToScroll,
      slidesToShow: this.props.slidesToShow,
      infinite: this.props.infinite
    });

    // Apply join & split to Array to pre-fill it for IE8
    //
    // Credit: http://stackoverflow.com/a/13735425/1849458
    const { onMouseEnter, onMouseOver, onMouseLeave } = this.props;
    const mouseEvents = { onMouseEnter, onMouseOver, onMouseLeave };
    var dots = Array.apply(
      null,
      Array(dotCount + 1)
        .join("0")
        .split("")
    ).map((x, i) => {
      var leftBound = i * this.props.slidesToScroll;
      var rightBound =
        i * this.props.slidesToScroll + (this.props.slidesToScroll - 1);
      var isSlideActive =
        this.props.currentSlide >= leftBound &&
        this.props.currentSlide <= rightBound;

      var className = classnames({ "slick-active": isSlideActive });

      var dotOptions = {
        message: "dots",
        index: i,
        slidesToScroll: this.props.slidesToScroll,
        currentSlide: this.props.currentSlide
      };

      var onClick = this.clickHandler.bind(this, dotOptions);
      return (
        <li
          key={i}
          role={this.props.useAriaRole ? "tab" : undefined}
          aria-labelledby={getNthDotAssociatedSlides(i, {
            slideCount: this.props.slideCount,
            slidesToScroll: this.props.slidesToScroll,
            slidesToShow: this.props.slidesToShow,
            infinite: this.props.infinite,
            name: this.props.name
          })}
          aria-controls={getNthDotAssociatedSlides(i, {
            slideCount: this.props.slideCount,
            slidesToScroll: this.props.slidesToScroll,
            slidesToShow: this.props.slidesToShow,
            infinite: this.props.infinite,
            name: this.props.name
          })}
          aria-selected={isSlideActive}
          className={className}
        >
          {React.cloneElement(this.props.customPaging(i), {
            onClick,
            "aria-labelledby": getNthDotAssociatedSlides(i, {
              slideCount: this.props.slideCount,
              slidesToScroll: this.props.slidesToScroll,
              slidesToShow: this.props.slidesToShow,
              infinite: this.props.infinite,
              name: this.props.name
            })
          })}
        </li>
      );
    });

    return React.cloneElement(
      this.props.appendDots(dots, this.props.useAriaRole),
      {
        className: this.props.dotsClass,
        ...mouseEvents,
      }
    );
  }
}
