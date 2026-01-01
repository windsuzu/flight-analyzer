import { BadgeCheck, TriangleAlert } from 'lucide-react';

interface ApiStatusIndicatorProps {
    source: 'amadeus' | 'mock' | 'mock_fallback' | null;
}

export function ApiStatusIndicator({ source }: ApiStatusIndicatorProps) {
    if (!source) return null;

    if (source === 'amadeus') {
        return (
            <div className="flex items-center space-x-2 text-xs text-green-400 bg-green-900/20 px-3 py-1 rounded-full border border-green-800">
                <BadgeCheck className="w-4 h-4" />
                <span>Live Amadeus Data</span>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-2 text-xs text-amber-400 bg-amber-900/20 px-3 py-1 rounded-full border border-amber-800">
            <TriangleAlert className="w-4 h-4" />
            <span>{source === 'mock_fallback' ? 'API Limit/Error - Using Demo Data' : 'Demo Mode'}</span>
        </div>
    );
}
