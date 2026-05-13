import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary';
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const isPrimary = variant === 'primary';

  const baseStyles = "flex items-center justify-center gap-2 rounded-full px-8 py-4 font-semibold text-base font-['Montserrat'] transition-opacity hover:opacity-90";
  const primaryStyles = "bg-gradient-to-br from-[#00A3FF] to-[#0066FF] shadow-[0_0_20px_0_rgba(0,163,255,0.3)] text-white";
  const secondaryStyles = "border border-[#E5E2E1] text-[#E5E2E1] bg-transparent hover:bg-[#E5E2E1]/10";

  const appliedStyles = `${baseStyles} ${isPrimary ? primaryStyles : secondaryStyles} ${className}`;

  return (
    <button className={appliedStyles} {...props}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
