import React, { CSSProperties } from 'react';

const burgerPath = `
  M6 8 L18 8
  M6 12 L18 12
  M6 16 L18 16
`;

const svgStyles: CSSProperties = {
  strokeWidth: 1.5,
  strokeLinecap: 'round',
};

const Hamburger = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="36"
    height="36"
    className="stroke-current"
    style={svgStyles}
  >
    <path d={burgerPath} />
  </svg>
);

export default Hamburger;
