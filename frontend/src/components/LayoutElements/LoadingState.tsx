import { Loader2 } from "lucide-react";

interface LoadingStateProps {
    message?: string;
    className?: string;
}

const LoadingState = ({ message, className = "" }: LoadingStateProps) => (
    <div className={`flex items-center justify-center gap-4 ${className}`}>
        <Loader2 className="w-12 h-12 text-gray-500 animate-spin" />
        {message && <p className="text-2xl text-gray-500">{message}</p>}
    </div>
);

export default LoadingState;
