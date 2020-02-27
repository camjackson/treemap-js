import React from 'react';

const crossPath = `
  M7 7 L17 17
  M17 7 L7 17
`;

const Cross = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="36"
    height="36"
    className="stroke-current"
  >
    <path d={crossPath} />
  </svg>
);

export default Cross;
