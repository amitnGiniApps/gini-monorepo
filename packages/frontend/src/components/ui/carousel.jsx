import React from "react";

export const Carousel = ({ children, className = "" }) => <div className={`flex overflow-x-auto whitespace-nowrap ${className}`}>{children}</div>;
export const CarouselItem = ({ children, className = "" }) => <div className={`block flex-wrap w-80 align-top ${className}`}>{children}</div>;
