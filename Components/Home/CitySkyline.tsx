import React from 'react'

// Original SVG skyline paths extracted for reuse and as the default fallback
const CitySkyline = () => {
  return (
    <svg width="100%" height="100%" href='main'>
      <use href="/building.svg" />
    </svg>
  );
};

export default CitySkyline