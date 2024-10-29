// Alert Component
export const Alert = ({ variant = "default", className, ...props }) => {
    const variantStyles = {
      default: "bg-background text-foreground",
      destructive: "bg-red-50 text-red-900 border-red-500",
    };
  
    return (
      <div
        role="alert"
        className={`relative w-full rounded-lg border p-4 ${variantStyles[variant]} ${className}`}
        {...props}
      />
    );
  };
  
   export const AlertDescription = ({ className, ...props }) => {
    return (
      <div
        className={`text-sm [&_p]:leading-relaxed ${className}`}
        {...props}
      />
    );
  };