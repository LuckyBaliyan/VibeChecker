import React from 'react';

const Button = ({ text, type = 'button', className = '', ...props }) => {
  return (
    <button
      type={type}
      className={`bg-white text-black rounded px-4 py-2 cursor-pointer ${className}`}
      {...props}
    >
      {text}
    </button>
  );
};

export default Button;
