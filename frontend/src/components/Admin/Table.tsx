import React from "react";

export const Table = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <div className="overflow-x-auto bg-[#1A1A1A] border border-gray-800 rounded-xl shadow-xl">
            <table className={`w-full text-left border-collapse ${className}`}>
                {children}
            </table>
        </div>
    );
};

export const Thead = ({ children }: { children: React.ReactNode }) => {
    return (
        <thead className="bg-[#151515] border-b border-gray-800">
            {children}
        </thead>
    );
};

export const Tbody = ({ children }: { children: React.ReactNode }) => {
    return (
        <tbody className="divide-y divide-gray-800/50">
            {children}
        </tbody>
    );
};

export const Tr = ({ children, className = "", onClick }: { children: React.ReactNode; className?: string; onClick?: () => void }) => {
    return (
        <tr className={`hover:bg-[#222222] transition-colors bg-[#1A1A1A] ${className} cursor-pointer`} onClick={onClick}>
            {children}
        </tr>
    );
};

export const Th = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <th className={`py-4 px-6 text-xs md:text-sm font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap ${className}`}>
            {children}
        </th>
    );
};

export const Td = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => {
    return (
        <td className={`py-4 px-6 text-sm text-gray-300 ${className}`}>
            {children}
        </td>
    );
};
