import React from 'react';

const RemoveCircle = ({ fill = '#C1C8CD', width = '25', className = '', viewBox = '0 0 25 25', fill2 }) => (
  <svg
    width={width}
    height={width}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      opacity="0.4"
      d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z"
      fill={fill}
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M14.2981 15.3587C14.591 15.6516 15.0659 15.6516 15.3588 15.3587C15.6517 15.0658 15.6517 14.5909 15.3588 14.298L13.0607 12L15.3588 9.70197C15.6516 9.40908 15.6516 8.9342 15.3588 8.64131C15.0659 8.34842 14.591 8.34842 14.2981 8.64131L12.0001 10.9393L9.70191 8.64118C9.40902 8.34829 8.93415 8.34829 8.64125 8.64118C8.34836 8.93407 8.34836 9.40895 8.64125 9.70184L10.9394 12L8.64124 14.2982C8.34835 14.5911 8.34835 15.0659 8.64124 15.3588C8.93413 15.6517 9.40901 15.6517 9.7019 15.3588L12.0001 13.0607L14.2981 15.3587Z"
      fill={fill2 || fill}
    />
  </svg>
);

export default RemoveCircle;
