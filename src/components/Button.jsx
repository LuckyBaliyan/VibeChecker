import React from 'react';

const variantClasses = {
  default: 'text-black',
  cyber: 'btn-cyber',
  ghostCyber: 'btn-ghost-cyber',
};

const Button = ({
  text,
  type = 'button',
  className = '',
  variant = 'default',
  children,
  ...props
}) => {
  const resolvedVariant = variantClasses[variant] || variantClasses.default;

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded px-4 py-2 text-xs font-semibold tracking-[0.16em] uppercase transition-all duration-200 cursor-pointer ${resolvedVariant} ${className}`}
      {...props}
    >
      {children || text}
    </button>
  );
};

export default Button;
