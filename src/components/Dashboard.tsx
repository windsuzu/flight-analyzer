'use client';

import { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import { PriceChart } from './PriceChart';
import { BookingAdvisor } from './BookingAdvisor';
import { ApiStatusIndicator } from './ApiStatusIndicator';
import { AirportSelect } from './AirportSelect';

// Common routes for quick selection
const PRESETS = [
    { label: 'Taipei to Tokyo', origin: 'TPE', dest: 'NRT' },
    { label: 'Taipei to Los Angeles', origin: 'TPE', dest: 'LAX' },
    { label: 'Taipei to London', origin: 'TPE', dest: 'LHR' },
    { label: 'Taipei to Singapore', origin: 'TPE', dest: 'SIN' },
];

export function Dashboard() {
    const [origin, setOrigin] = useState('TPE');
    const [destination, setDestination] = useState('NRT');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<any[] | null>(null);
    const [source, setSource] = useState<'amadeus' | 'mock' | 'mock_fallback' | null>(null);
    const [error, setError] = useState('');

    const handleSearch = async () => {
        if (!origin || !destination) return;
        setLoading(true);
        setError('');
        setData(null);
        setSource(null);

        try {
            const res = await fetch('/api/price-trend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ origin, destination }),
            });

            const json = await res.json();

            if (res.ok) {
                setData(json.data);
                setSource(json.source);
            } else {
                setError(json.error || 'Failed to fetch data');
            }
        } catch (err) {
            setError('An error occurred. Using demo data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 space-y-8">
            {/* Header */}
            <div className="text-center space-y-2">
                <h1 className="text-4xl md:text-5xl font-extrabold pb-2 bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent">
                    Flight Price Analyzer
                </h1>
                <p className="text-slate-400 max-w-2xl mx-auto text-lg">
                    Is it really cheaper to book 3-4 months early?
                    <span className="block text-sm mt-2 text-slate-500">
                        (We analyze live prices for flights departing in 1 week vs. 6 months to find out)
                    </span>
                </p>
            </div>

            {/* Control Panel */}
            <div className="glass-panel p-6 rounded-2xl relative z-50">
                <div className="flex flex-col md:flex-row gap-4 items-end relative z-50">
                    <div className="flex-1 w-full z-30 relative space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Origin</label>
                        <AirportSelect
                            value={origin}
                            onChange={setOrigin}
                        />
                    </div>
                    <div className="flex-1 w-full z-20 relative space-y-2">
                        <label className="text-sm font-medium text-slate-400 ml-1">Destination</label>
                        <AirportSelect
                            value={destination}
                            onChange={setDestination}
                        />
                    </div>
                    <div className="w-full md:w-auto z-10 relative">
                        <button
                            onClick={handleSearch}
                            disabled={loading || !origin || !destination}
                            className="w-full px-8 py-3 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 h-[54px]"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
                            <span>Analyze</span>
                        </button>
                    </div>
                </div>

                {/* Presets */}
                <div className="mt-4 flex flex-wrap gap-2 relative z-0">
                    <span className="text-xs text-slate-500 self-center mr-2">Quick Routes:</span>
                    {PRESETS.map(p => (
                        <button
                            key={p.label}
                            onClick={() => { setOrigin(p.origin); setDestination(p.dest); }}
                            className="px-3 py-1 text-xs rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        >
                            {p.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Area */}
            {error && (
                <div className="p-4 bg-red-900/20 border border-red-800 text-red-200 rounded-xl text-center">
                    {error}
                </div>
            )}

            {data && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-0">
                    <div className="flex justify-between items-center px-2">
                        <h2 className="text-2xl font-bold text-white">Price Approach Analysis</h2>
                        <ApiStatusIndicator source={source} />
                    </div>

                    <BookingAdvisor data={data} />
                    <PriceChart data={data} />


                </div>
            )}
        </div>
    );
}
