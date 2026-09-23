# Stocklana submit checklist — PreStocks Board

## Links

| Item | Value |
| --- | --- |
| Hackathon | **Stocklana** (Solana) |
| Hackathon URL | https://hackathons.solana.com/hackathons/stocklana |
| Sponsor track | **PreStocks** |
| Deadline (reference) | Sep 25, 2026 · 4 PM ET (confirm on official page) |
| Repo owner | `flipperspectives-crypto` (create/push after review — do not push from scaffold agent) |
| Suggested repo name | `stocklana-prestocks` |
| Live demo | Host `dist/` on free static hosting after `npm run build` |
| Data source | https://prestocks.com/api/prestocks (free, public) |

## Track pitch (short)

> Live PreStocks pre-IPO board: mark vs token premium/discount for every listed PreStock, with mint links — $0 capital, free public API only, static Vite app for Stocklana PreStocks track.

## Checklist before submit

- [ ] `npm install && npm run build` succeeds locally
- [ ] `npm run preview` shows live cards (API reachable)
- [ ] README problem / API / run / track sections look good
- [ ] Create public GitHub repo under **flipperspectives-crypto**
- [ ] Push this folder (do **not** commit `node_modules/` or secrets)
- [ ] Optional: enable GitHub Pages / Cloudflare Pages on `dist` or Vite build
- [ ] Paste repo + demo URL into Stocklana submission form
- [ ] Select **PreStocks** sponsored track / bounty
- [ ] Confirm deadline timezone on https://hackathons.solana.com/hackathons/stocklana
- [ ] One-liner for judges: Havana/LATAM builder, $0 deploy path, free PreStocks API

## Out of scope for v1 (intentionally)

- Token launch / bonding curve
- Mainnet program deploy (fees)
- Paid market-data APIs
- Wallet connect / trading (can be a follow-up)

## Local path

```text
/workspace/stocklana-prestocks
```
