import { X } from "lucide-react";
import Button from "../Elements/Button";

interface FilterChipProps {
    label: string;
    onRemove: () => void;
    className?: string;
}

export const FilterChip = ({ label, onRemove, className = "" }: FilterChipProps) => {
    return (
        <Button
            variant="primary"
            onClick={onRemove}
            className={`!py-1.5 !px-3 !text-xs flex items-center gap-1.5 w-auto ${className}`}
        >
            {label}
            <X className="w-3.5 h-3.5" />
        </Button>
    );
};

export default FilterChip;
