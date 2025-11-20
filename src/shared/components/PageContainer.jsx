import React from 'react';

/**
 * Common page container wrapper with consistent styling
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Content to render inside container
 * @param {string} props.maxWidth - Maximum width (default: '1200px')
 * @param {string} props.className - Additional CSS class name
 */
const PageContainer = ({ children, maxWidth = '1200px', className = '' }) => {
  return (
    <div 
      className={className}
      style={{ 
        minHeight: '100vh', 
        padding: '20px',
        maxWidth: maxWidth,
        margin: '0 auto'
      }}
    >
      {children}
    </div>
  );
};

export default PageContainer;

