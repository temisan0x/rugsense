# RugSense

Paste a Solana token address. Get an instant rug risk score.

RugSense analyzes liquidity, holder concentration, trading volume, and token age to return a deterministic **SAFE / WATCH / DANGER** verdict — no ML, no black box.

Built for the [Birdeye Data BIP Sprint 4](https://birdeye.so) hackathon.

---

## How it works

Each scan makes two sequential Birdeye API calls:

1. `/defi/token_overview` — liquidity, volume, price, token age  
2. `/v1/token/holder` — top 10 holder concentration  

These signals feed a weighted heuristic engine that produces a score from 0–100:

| Signal | Max penalty |
|---|---|
| Top 10 holders > 80% supply | +35 |
| Liquidity under $10K | +30 |
| Volume/liquidity ratio > 12x | +20 |
| Token age under 30 minutes | +15 |

Scores map to: `0–30 → SAFE`, `31–60 → WATCH`, `61+ → DANGER`

---

## Stack

- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind CSS
- shadcn/ui components
- Birdeye public API
- In-memory cache (60s TTL, no Redis)
- html2canvas for PNG export

---

## API

GET /api/scan?address=TOKEN_ADDRESS


```json
{
  "success": true,
  "risk": {
    "score": 45,
    "label": "WATCH",
    "confidence": 78,
    "reasons": ["Liquidity critically low", "Potential inorganic trading activity"]
  },
  "overview": {
    "name": "Bonk",
    "symbol": "BONK",
    "liquidity": 4100000,
    "v24hUSD": 16500000
  },
  "meta": {
    "top10Ownership": 12.4,
    "ageMinutes": 521400,
    "holdersAnalyzed": 10,
    "scannedAt": 1715000000000
  }
}

## Setup

```bash
git clone https://github.com/temisan0x/rugsense.git
cd rugsense
npm install
```

Create `.env.local`:

```
BIRDEYE_API_KEY=your_key_here
```

```bash
npm run dev
```

---

## Demo tokens

| Token | Expected result |
|------|----------------|
| BONK | SAFE |
| WIF | SAFE |
| PEPE Solana | DANGER |

---

Not financial advice. Experimental tool — always do your own research.

---

## What was actually fixed (no fluff)

- Removed mixed block nesting edge cases  
- Clean separation between tables and code blocks  
- Ensured GitHub-safe spacing rules  
- Standardized list formatting for deterministic rendering  