# PreStocks Board · Stocklana

Thin public MVP for the **Solana Stocklana** hackathon (**PreStocks** track).

Live pre-IPO board: company name/symbol, mark price, token price, premium/discount %, and Solana mint link — powered only by the **free** public PreStocks API. No token launch, no paid APIs, no mainnet deploy fees required for v1 ($0 capital).

**GitHub (intended):** [flipperspectives-crypto](https://github.com/flipperspectives-crypto)

## Problem

Pre-IPO marks and on-chain PreStocks token prices diverge. Builders and LATAM users need a **readable, mobile-ok board** that shows that gap at a glance — without spinning up infra or paying for data.

## How the PreStocks API is used

Endpoint (CORS-friendly, free, no key):

```text
GET https://prestocks.com/api/prestocks
```

Response is a JSON **array** of objects. Fields this app uses:

| Field | Use |
| --- | --- |
| `name`, `symbol` | Card title / ticker |
| `image`, `external_url` | Logo + link back to PreStocks |
| `markPrice` | Reference private-company mark |
| `tokenPrice` | On-chain / market PreStocks price |
| `markValuation`, `impliedValuation` | Compact valuation context |
| `contract_address` | Solana mint → Solscan link |

**Premium / discount:**

```text
((tokenPrice - markPrice) / markPrice) * 100
```

Positive = token trading at a premium to mark; negative = discount. Cards sort by absolute gap so outliers float up. Auto-refresh every 60s.

No wallet, no signing, no RPC keys — browser `fetch` only.

## How to run

```bash
cd stocklana-prestocks
npm install
npm run dev          # local http://localhost:5173
npm run build        # static output → dist/
npm run preview      # serve dist/
```

Deploy `dist/` to any free static host (GitHub Pages, Cloudflare Pages, Netlify, etc.). `base: './'` in Vite config keeps relative asset paths portable.

## Stocklana / PreStocks track intent

- **Hackathon:** [Stocklana](https://hackathons.solana.com/hackathons/stocklana) (Solana)
- **Track:** PreStocks — best use of PreStocks / pre-IPO stocks on Solana
- **This submission:** a public, zero-cost dashboard that surfaces mark vs token premium using PreStocks’ public catalogue API — a clear entry point for research and further on-chain tooling (split-aware pricing, baskets, alerts) without requiring deploy capital for v1.

See [SUBMIT.md](./SUBMIT.md) for the submit checklist.

## License

MIT — hackathon demo code.
