// Card.js
import React from 'react';

export const Card = ({ children, className = '' }) => (
  <div className={`bg-white shadow-md rounded-lg overflow-hidden ${className}`}>
    {children}
  </div>
);

export const CardHeader = ({ children }) => (
  <div className="p-4 border-b border-gray-200">
    {children}
  </div>
);

export const CardTitle = ({ children }) => (
  <h2 className="text-lg font-semibold text-gray-800">
    {children}
  </h2>
);

export const CardContent = ({ children }) => (
  <div className="p-4">
    {children}
  </div>
);

export const CardFooter = ({ children }) => (
  <div className="p-4 border-t border-gray-200">
    {children}
  </div>
);

// Badge Component
export const Badge = ({ 
    variant = "default", 
    className, 
    ...props 
  }) => {
    const variantStyles = {
      default: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
      destructive: "bg-destructive text-destructive-foreground",
      outline: "text-foreground",
    };
  
    return (
      <div
        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 
          ${variantStyles[variant]} 
          ${className}`}
        {...props}
      />
    );
  };
  
  // Separator Component
  export const Separator = ({ 
    orientation = "horizontal", 
    className, 
    ...props 
  }) => {
    return (
      <div
        role="separator"
        className={`shrink-0 bg-border 
          ${orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]"}
          ${className}`}
        {...props}
      />
    );
  };
