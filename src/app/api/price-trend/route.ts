import { NextResponse } from 'next/server';
import amadeus from '@/lib/amadeus';
import { generateMockData, PricePoint } from '@/utils/flightDataGenerator';

// Simple in-memory cache
const CACHE = new Map<string, { timestamp: number, data: any, source: string }>();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { origin, destination } = body;

        if (!origin || !destination) {
            return NextResponse.json({ error: 'Missing origin or destination' }, { status: 400 });
        }

        // 1. Check Cache
        const cacheKey = `${origin}-${destination}`;
        const cached = CACHE.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < CACHE_DURATION)) {
            console.log(`Returning cached data for ${cacheKey}`);
            return NextResponse.json({ source: cached.source, data: cached.data, cached: true });
        }

        // Check if API keys are configured
        const hasKeys = !!process.env.AMADEUS_CLIENT_ID && !!process.env.AMADEUS_CLIENT_SECRET;

        if (!hasKeys) {
            console.log('No API keys found. Returning mock data.');
            const data = generateMockData();
            return NextResponse.json({ source: 'mock', data });
        }

        // Real API Implementation
        // We want to check prices for flights departing in X days
        const daysOffsets = [1, 3, 7, 14, 21, 30, 45, 60, 90, 120, 150, 180];
        const today = new Date();

        const results: PricePoint[] = [];
        const errors: any[] = [];

        // Process sequentially (or batched) to respect rate limits (approx 100ms between calls)
        for (const days of daysOffsets) {
            const targetDate = new Date(today);
            targetDate.setDate(today.getDate() + days);
            const dateStr = targetDate.toISOString().split('T')[0];

            try {
                // Amadeus Flight Offers Search
                // @ts-ignore
                const response = await amadeus.shopping.flightOffersSearch.get({
                    originLocationCode: origin,
                    destinationLocationCode: destination,
                    departureDate: dateStr,
                    adults: '1',
                    max: '1' // We only need the cheapest flight to gauge the baseline
                });

                if (response.data && response.data.length > 0) {
                    const offer = response.data[0];
                    const price = parseFloat(offer.price.total);
                    results.push({
                        daysPrior: days,
                        price: price,
                        dateStr: dateStr
                    });
                }

                // Brief pause to be nice to the API test environment
                await new Promise(r => setTimeout(r, 200));

            } catch (err: any) {
                console.error(`Error fetching for T+${days}`, err?.description || err);
                errors.push({ days, error: err?.description });
                // Continue to next date even if one fails
            }
        }

        if (results.length === 0) {
            // Fallback if real API returns nothing (or bad routes)
            return NextResponse.json({ source: 'mock_fallback', data: generateMockData() });
        }

        // 2. Save to Cache
        CACHE.set(cacheKey, {
            timestamp: Date.now(),
            data: results,
            source: 'amadeus'
        });

        return NextResponse.json({ source: 'amadeus', data: results, errors });

    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
