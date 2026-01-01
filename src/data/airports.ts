import airportsData from './airports.json';

export interface Airport {
    code: string;
    name: string;
    city: string;
    country: string;
}

// Data is already processed by our script into the correct format
// We simply cast it (or validate if we were strict)
const AIRPORTS_LIST = airportsData as Airport[];

export const AIRPORTS = AIRPORTS_LIST;

export function searchAirports(query: string): Airport[] {
    const q = query.toLowerCase().trim();

    if (!q) return [];

    // Exact match optimization
    if (q.length === 3) {
        const exact = AIRPORTS_LIST.find(a => a.code.toLowerCase() === q);
        if (exact) return [exact];
    }

    // Optimized search
    // Limit results to 50 for performance
    const results: Airport[] = [];
    const maxResults = 50;

    for (const airport of AIRPORTS_LIST) {
        const city = airport.city ? airport.city.toLowerCase() : '';
        const name = airport.name ? airport.name.toLowerCase() : '';
        const code = airport.code.toLowerCase();

        if (
            code.startsWith(q) ||
            city.startsWith(q) ||
            city.includes(q) ||
            name.includes(q)
        ) {
            results.push(airport);
            if (results.length >= maxResults) break;
        }
    }

    return results;
}
