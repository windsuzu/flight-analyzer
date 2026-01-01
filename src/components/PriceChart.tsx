'use client';

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceArea
} from 'recharts';

interface PriceChartProps {
    data: { daysPrior: number; price: number; dateStr: string }[];
}

export function PriceChart({ data }: PriceChartProps) {
    if (!data || data.length === 0) return null;

    // Recharts needs data sorted by something axis-friendly.
    // We want X-axis to be "Booking Days in Advance" (0 to 180) or "Date".
    // The hypothesis is "3-4 months early". So "Days Prior" is the key metric.
    // Data comes in { daysPrior: 0...180 }. 
    // Let's sort by daysPrior ascending (0 -> 180).
    const chartData = [...data].sort((a, b) => a.daysPrior - b.daysPrior);

    return (
        <div className="h-[450px] w-full glass-panel p-6 pb-12 rounded-xl flex flex-col">
            <h3 className="text-lg font-semibold mb-2 text-slate-300 shrink-0">
                Price Trend vs. Booking Lead Time
            </h3>
            <div className="flex-1 w-full min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />

                        <XAxis
                            dataKey="daysPrior"
                            label={{ value: 'Days In Advance', position: 'insideBottom', offset: -10, fill: '#94a3b8' }}
                            stroke="#94a3b8"
                            tickFormatter={(value) => `${value}d`}
                        />

                        <YAxis
                            stroke="#94a3b8"
                            tickFormatter={(value) => `$${value}`}
                            domain={['auto', 'auto']}
                        />

                        <Tooltip
                            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', color: '#f8fafc' }}
                            itemStyle={{ color: '#60a5fa' }}
                            formatter={(value) => [`$${value}`, 'Price']}
                            labelFormatter={(label) => `${label} days before flight`}
                        />

                        {/* Highlight the 3-4 months (90-120 days) area */}
                        <ReferenceArea x1={90} x2={120} strokeOpacity={0.3} fill="#6366f1" fillOpacity={0.1}>
                            {/* Label component or just use generic markup? Recharts ReferenceArea doesn't take children easily in types sometimes */}
                        </ReferenceArea>

                        <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#60a5fa"
                            strokeWidth={3}
                            dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#1e293b' }}
                            activeDot={{ r: 8 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="text-center text-xs text-slate-500 mt-4 shrink-0">
                <span className="inline-block w-3 h-3 bg-indigo-500/20 border border-indigo-500/50 mr-1 align-middle"></span>
                Highlighted area: 3-4 months prior (90-120 days)
            </div>
        </div>
    );
}
