
import React from 'react';
import { Priority } from '../types';
import {
    AlertCircle,
    ChevronUp,
    ChevronRight,
    ChevronDown,
    ChevronsUp
} from 'lucide-react';

interface PriorityIconProps {
    priority: Priority;
    className?: string;
}

const PriorityIcon: React.FC<PriorityIconProps> = ({ priority, className = "h-4 w-4" }) => {
    switch (priority) {
        case 'URGENT':
            return <AlertCircle className={`${className} text-red-500`} />;
        case 'HIGH':
            return <ChevronsUp className={`${className} text-orange-500`} />;
        case 'MEDIUM':
            return <ChevronUp className={`${className} text-blue-500`} />;
        case 'LOW':
            return <ChevronDown className={`${className} text-gray-400`} />;
        default:
            return <ChevronRight className={`${className} text-gray-400`} />;
    }
};

export default PriorityIcon;
