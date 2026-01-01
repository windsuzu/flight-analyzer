'use client';

import { useState, useEffect, useRef } from 'react';
import { Check, ChevronsUpDown, Plane } from 'lucide-react';
import { Airport, searchAirports, AIRPORTS } from '../data/airports';
import clsx from 'clsx'; // Assuming clsx is installed via shadcn setup or we use template literals

interface AirportSelectProps {
    value: string; // The IATA code
    onChange: (code: string) => void;
}

export function AirportSelect({ value, onChange }: AirportSelectProps) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [filteredAirports, setFilteredAirports] = useState<Airport[]>(AIRPORTS);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Update filter
    useEffect(() => {
        setFilteredAirports(searchAirports(query));
    }, [query]);

    // Handle selection
    const handleSelect = (code: string) => {
        onChange(code);
        setOpen(false);
        setQuery(''); // Reset search
    };

    // Find selected airport object for display
    const selectedAirport = AIRPORTS.find(a => a.code === value);

    return (
        <div className="relative w-full h-[54px]" ref={containerRef}>

            <div
                onClick={() => setOpen(!open)}
                className={clsx(
                    "w-full h-[54px] bg-slate-900/50 rounded-xl px-4 flex items-center justify-between cursor-pointer transition-colors ring-1 ring-inset",
                    open ? "ring-blue-500 shadow-[0_0_0_1px_rgba(59,130,246,1)]" : "ring-slate-700 hover:ring-slate-600"
                )}
            >
                <span className={clsx("flex items-center space-x-2 text-lg font-semibold", !value && "text-slate-500")}>
                    <Plane className="w-4 h-4 text-slate-400" />
                    <span>{value || "Select Airport"}</span>
                    {selectedAirport && (
                        <span className="text-sm font-normal text-slate-400 ml-2 truncate">
                            {selectedAirport.city}, {selectedAirport.country}
                        </span>
                    )}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-slate-500" />
            </div>

            {open && (
                <div className="absolute z-[100] w-full mt-2 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-h-80 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-2 border-b border-slate-800">
                        <input
                            autoFocus
                            placeholder="Search city or code..."
                            className="w-full bg-slate-800/50 text-white px-3 py-2 rounded-lg text-sm outline-none placeholder:text-slate-500 focus:bg-slate-800"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    <div className="overflow-y-auto flex-1 p-1">
                        {filteredAirports.length === 0 ? (
                            <div className="p-4 text-center text-sm text-slate-500">No airports found.</div>
                        ) : (
                            filteredAirports.map((airport) => (
                                <div
                                    key={airport.code}
                                    onClick={() => handleSelect(airport.code)}
                                    className={clsx(
                                        "flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group",
                                        value === airport.code ? "bg-blue-600/20 text-blue-400" : "hover:bg-slate-800 text-slate-300"
                                    )}
                                >
                                    <div className="flex flex-col">
                                        <span className="font-bold text-base flex items-center">
                                            {airport.code}
                                            <span className="font-normal text-slate-500 mx-2">-</span>
                                            <span className="font-medium text-white group-hover:text-white/90">{airport.city}</span>
                                        </span>
                                        <span className="text-xs text-slate-500 truncate max-w-[250px]">{airport.name}</span>
                                    </div>
                                    {value === airport.code && <Check className="w-4 h-4 text-blue-400" />}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
