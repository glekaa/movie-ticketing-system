import React from "react";
import type { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes, ReactNode } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, className = "", ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold block">{label}</label>
                <input
                    ref={ref}
                    className={`w-full bg-[#121111] border border-white/5 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);
FormInput.displayName = "FormInput";

interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    error?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
    ({ label, error, className = "", rows = 4, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold block">{label}</label>
                <textarea
                    ref={ref}
                    rows={rows}
                    className={`w-full bg-[#121111] border border-white/5 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all placeholder:text-gray-600 resize-none ${className}`}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);
FormTextarea.displayName = "FormTextarea";

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    error?: string;
    children: ReactNode;
}

export const FormSelect = React.forwardRef<HTMLSelectElement, FormSelectProps>(
    ({ label, error, className = "", children, ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="text-xs text-gray-400 font-semibold block">{label}</label>
                <select
                    ref={ref}
                    className={`w-full bg-[#121111] border border-white/5 focus:border-blue-500 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none transition-all cursor-pointer ${className}`}
                    {...props}
                >
                    {children}
                </select>
                {error && (
                    <p className="text-xs text-red-500 mt-1">{error}</p>
                )}
            </div>
        );
    }
);
FormSelect.displayName = "FormSelect";
