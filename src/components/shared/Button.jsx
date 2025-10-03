import React from 'react';
import './Button.css';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'normal',
  disabled = false,
  onClick,
  ...props 
}) {
  const className = `btn btn-${variant} ${size === 'large' ? 'btn-large' : ''}`;
  
  return (
    <button 
      className={className}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

