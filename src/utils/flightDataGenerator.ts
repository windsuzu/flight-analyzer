// Utility to generate realistic mock flight price data
// Simulates the "U-shaped" curve: High prices far out (sometimes), dipping 3-4 months out, rising sharply last minute.

export interface PricePoint {
    daysPrior: number; // e.g., 90 days before flight
    price: number;
    dateStr: string; // ISO date string for the hypothetical flight date
}

export function generateMockData(basePrice: number = 500): PricePoint[] {
    const data: PricePoint[] = [];
    const today = new Date();

    // Generate data for 0 to 180 days out (6 months)
    for (let days = 0; days <= 180; days += 3) { // Plot every 3 days
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + days);

        // Simulation Algorithm:
        // 1. Base demand curve: higher near 0, lower near 90-120, higher near 180 (far out premium)
        // Formula: y = a(x-h)^2 + k
        // We want a dip around 90-120 days.

        let fluctuation = 0;

        // "Last Minute" penalty (0-21 days): Exponential increase
        if (days < 21) {
            fluctuation += basePrice * (1.5 * Math.exp(-0.1 * days));
        }

        // "Sweet Spot" discount (60-120 days):
        if (days > 60 && days < 120) {
            fluctuation -= basePrice * 0.2; // 20% cheaper
            // Add random noise for realism
            fluctuation += (Math.random() - 0.5) * 50;
        }

        // "Too Early" moderate pricing (150+ days):
        if (days > 150) {
            fluctuation += basePrice * 0.1;
        }

        // General noise
        fluctuation += (Math.random() - 0.5) * 20;

        const price = Math.round(basePrice + fluctuation);

        data.push({
            daysPrior: days,
            price: Math.max(50, price), // Ensure no negative prices
            dateStr: targetDate.toISOString().split('T')[0],
        });
    }

    // Return sorted by date (days 0 -> 180 is "Today" -> "Future")
    // For the chart, X-axis is "Days until flight" or "Booking Date"?
    // User question: "bought ticket 3 or 4 months early".
    // So X-axis should be "Days before departure".
    // This means "Day 0" is Flight Date. "Day 90" is Booking 90 days prior.
    // The 'data' array above represents "Prices for a flight departing in X days".
    // Which effectively is the "Lead Time" curve.

    return data;
}
