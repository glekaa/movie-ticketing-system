import type { HTMLAttributes, ReactNode } from "react";

interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  variant?: "primary" | "secondary";
}

const Tag = ({ children, variant = "primary", className = "", ...props }: TagProps) => {
  const isPrimary = variant === "primary";

  const baseStyles = "inline-flex items-center justify-center font-['Inter']";
  const primaryStyles = "px-3 py-1 rounded-full bg-[#141313]/50 border border-[#444748]/30 backdrop-blur-md text-[#C4C7C7] text-sm leading-5";
  const secondaryStyles = "px-2 py-0.5 rounded border border-[#444748]/50 text-[#E5E2E1] font-bold text-xs leading-4";

  const appliedStyles = `${baseStyles} ${isPrimary ? primaryStyles : secondaryStyles} ${className}`;

  return (
    <span className={appliedStyles} {...props}>
      {children}
    </span>
  );
};

export default Tag;
