import Amadeus from 'amadeus';

let amadeus: any; // eslint-disable-line @typescript-eslint/no-explicit-any

// Only initialize if environment variables are present to avoid build-time errors
// This prevents "Access denied" or crashing during static generation when env vars aren't set
if (process.env.AMADEUS_CLIENT_ID && process.env.AMADEUS_CLIENT_SECRET) {
    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        amadeus = new (Amadeus as any)({
            clientId: process.env.AMADEUS_CLIENT_ID,
            clientSecret: process.env.AMADEUS_CLIENT_SECRET,
        });
    } catch (e) {
        console.warn("Failed to initialize Amadeus client:", e);
        amadeus = null;
    }
} else {
    // Return undefined/null. The API route must check for this.
    amadeus = null;
}

export default amadeus;
