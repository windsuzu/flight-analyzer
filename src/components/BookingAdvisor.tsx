interface BookingAdvisorProps {
    data: { daysPrior: number; price: number; dateStr: string }[];
}

export function BookingAdvisor({ data }: BookingAdvisorProps) {
    if (!data || data.length === 0) return null;

    // Find lowest price
    const lowest = data.reduce((min, p) => (p.price < min.price ? p : min), data[0]);

    // Find "Buying Now" price (approximately) - usually the lowest daysPrior (e.g. 1 or 3)
    const currentPrice = data.reduce((curr, p) => (p.daysPrior < curr.daysPrior ? p : curr), data[0]);

    const savings = currentPrice.price - lowest.price;
    const savingsPercent = Math.round((savings / currentPrice.price) * 100);

    return (
        <div className="glass-panel p-6 rounded-xl space-y-4">
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                Analysis Result
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400">Best Time to Buy</p>
                    <p className="text-2xl font-semibold text-white">
                        {lowest.daysPrior === 0 ? 'Today' : `${lowest.daysPrior} days before`}
                    </p>
                    <p className="text-xs text-slate-500">Target Date: {lowest.dateStr}</p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400">Lowest Price Found</p>
                    <p className="text-2xl font-semibold text-green-400">
                        ${lowest.price}
                    </p>
                </div>

                <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                    <p className="text-sm text-slate-400">Potential Savings</p>
                    <p className={`text-2xl font-semibold ${savings > 0 ? 'text-blue-400' : 'text-slate-300'}`}>
                        {savings > 0 ? `$${savings} (${savingsPercent}%)` : 'None'}
                    </p>
                    {savings > 0 && <p className="text-xs text-slate-500">vs. booking last minute</p>}
                </div>
            </div>

            <div className="text-sm text-slate-300 italic border-l-2 border-primary pl-4 py-1">
                {savings > 0
                    ? `Based on current trends, you could save significantly by booking ${lowest.daysPrior} days in advance instead of last minute.`
                    : "Surprisingly, prices are fairly flat or lowest right now. It might be a good time to book!"}
            </div>
        </div>
    );
}
