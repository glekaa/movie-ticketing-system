import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode;
  variant?: "primary" | "secondary";
  icon?: React.ReactNode;
}

const Button = ({ children, variant = "primary", icon, className = "", ...props }: ButtonProps) => {
  const isPrimary = variant === "primary";

  const baseStyles = "flex items-center justify-center gap-2 rounded-full px-6 py-2 font-semibold text-sm font-['Montserrat'] transition-all duration-300 ease-out hover:scale-105 active:scale-95 tracking-wide cursor-pointer";
  const primaryStyles = "bg-gradient-to-b from-[#00A3FF] to-[#0055FF] shadow-[0_8px_20px_-4px_rgba(0,102,255,0.5)] hover:shadow-[0_0px_25px_rgba(0,102,255,0.7)] ring-1 ring-inset ring-white/30 text-white hover:brightness-110";
  const secondaryStyles = "bg-white/5 backdrop-blur-md border border-white/10 text-gray-200 shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:bg-white/10 hover:text-white hover:border-white/30 hover:shadow-[0_0_25px_rgba(255,255,255,0.15)] ring-1 ring-inset ring-transparent hover:ring-white/5";

  const appliedStyles = `${baseStyles} ${isPrimary ? primaryStyles : secondaryStyles} ${className}`;

  return (
    <button className={appliedStyles} {...props}>
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
