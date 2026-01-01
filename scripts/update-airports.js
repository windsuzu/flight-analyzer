const fs = require('fs');
const path = require('path');
const https = require('https');

const URL = 'https://raw.githubusercontent.com/mwgg/Airports/master/airports.json';
const OUTPUT_PATH = path.join(__dirname, '../src/data/airports.json');

console.log(`Fetching airport data from ${URL}...`);

https.get(URL, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        try {
            const rawAirports = JSON.parse(data);
            const processedAirports = [];

            // mwgg/Airports is keyed by ICAO code (e.g. "KJFK": { ... })
            Object.keys(rawAirports).forEach(icao => {
                const airport = rawAirports[icao];

                // Filter criteria:
                // 1. Must have an IATA code (3 letters)
                // 2. Must be an active airport (not closed, though the dataset doesn't explicitly say "closed" often, checking IATA is a good proxy for commercial relevance)
                // 3. Optional: Filter by 'type' (medium_airport, large_airport) to reduce noise?
                // Let's filter for IATA existence and sanity check name

                if (airport.iata && airport.iata.length === 3 && airport.name && airport.city) {
                    processedAirports.push({
                        code: airport.iata,
                        name: airport.name,
                        city: airport.city,
                        country: airport.country,
                        // Include ICAO if needed, but we stick to the interface
                    });
                }
            });

            // Sort by City for better UX
            processedAirports.sort((a, b) => a.city.localeCompare(b.city));

            console.log(`Processed ${processedAirports.length} airports.`);

            fs.writeFileSync(OUTPUT_PATH, JSON.stringify(processedAirports, null, 2));
            console.log(`Successfully wrote to ${OUTPUT_PATH}`);

        } catch (err) {
            console.error('Error parsing or writing data:', err);
            process.exit(1);
        }
    });

}).on('error', (err) => {
    console.error('Error fetching data:', err);
    process.exit(1);
});
