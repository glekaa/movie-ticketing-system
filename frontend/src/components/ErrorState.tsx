import { TriangleAlert } from "lucide-react";

interface ErrorStateProps {
    message?: string;
    className?: string;
}

const ErrorState = ({ message = "Something went wrong", className = "" }: ErrorStateProps) => (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
        <TriangleAlert className="w-12 h-12 text-red-500" />
        <p className="text-2xl text-red-500">{message}</p>
    </div>
);

export default ErrorState;
