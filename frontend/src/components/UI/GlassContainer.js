import React from 'react';

const GlassContainer = ({ 
  children, 
  className = '', 
  variant = 'default',
  hover = false,
  onClick = null 
}) => {
  const getVariantClasses = () => {
    switch (variant) {
      case 'strong':
        return 'glass-panel-strong';
      case 'card':
        return 'glass-card';
      default:
        return 'glass-panel';
    }
  };

  const baseClasses = `
    ${getVariantClasses()}
    rounded-lg
    ${hover ? 'transition-all duration-300 hover:scale-[1.02]' : ''}
    ${onClick ? 'cursor-pointer' : ''}
    ${className}
  `.trim();

  return (
    <div className={baseClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default GlassContainer;