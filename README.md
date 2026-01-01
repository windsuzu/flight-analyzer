# Flight Insight | Strategic Price Analytics

![Flight Insight Banner](https://img.shields.io/badge/Status-Production%20Ready-blue?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=for-the-badge&logo=next.js)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.0-cyab?style=for-the-badge&logo=tailwindcss)
![Amadeus API](https://img.shields.io/badge/Data-Amadeus%20API-1A55E3?style=for-the-badge)

**Flight Insight** is a strategic analytics platform designed to verify the "Book Early" hypothesis. Instead of relying on static historical datasets, it performs "Future Trend Analysis" by querying live flight data for future departure dates (e.g., +7 days, +30 days, ... +6 months) to construct a real-time pricing curve.

## 🚀 Key Features

*   **Real-time Price Engine**: Integrates with the **Amadeus Self-Service API** to fetch live global flight data.
*   **Smart Fallback System**: Automatically switches to a sophisticated **Mock Data Generative Model** if API keys are missing or limits are reached—ensuring the UI is always demo-ready.
*   **Trend Visualization**: Interactive line charts (powered by Recharts) mapping price vs. booking lead time.
*   **Strategic Advisory**: Algorithms that calculate potential savings and identify the optimal "Sweet Spot" for booking.
*   **Premium UX**: Fully responsive, dark-mode-first interface featuring glassmorphism, smooth micro-animations, and a layout-stable design.

## 🛠️ Technology Stack

*   **Framework**: Next.js 16 (App Router)
*   **Styling**: Tailwind CSS v4 (with custom glass utilities)
*   **Visualization**: Recharts
*   **Icons**: Lucide React
*   **Integration**: Amadeus Node SDK

## 🏁 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/yourusername/flight-insight.git
cd flight-insight
npm install
```

### 2. Configure Environment (Optional)
The app runs in **Demo Mode** out of the box. To enable live data:

1.  Get your **API Key** and **Secret** from [Amadeus for Developers](https://developers.amadeus.com).
2.  Copy the example env file:
    ```bash
    cp env.example .env.local
    ```
3.  Add your credentials to `.env.local`:
    ```env
    AMADEUS_CLIENT_ID=your_key
    AMADEUS_CLIENT_SECRET=your_secret
    ```

### 3. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to start analyzing.

## 🌍 Deployment

This project is optimized for deployment on **Vercel**.

1.  Push your code to GitHub/GitLab.
2.  Import the project into Vercel.
3.  **CRITICAL**: In the Vercel Project Settings, add your Environment Variables (`AMADEUS_CLIENT_ID`, `AMADEUS_CLIENT_SECRET`).
4.  Deploy!

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
