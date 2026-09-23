# Judge queries

PreStocks is a free, public JSON API; no key or secret is required.

## Fetch the full catalogue

```bash
curl -sS https://prestocks.com/api/prestocks
```

## Inspect the first five symbols and prices

```bash
curl -sS https://prestocks.com/api/prestocks \
  | jq '.[:5] | map({symbol, name, markPrice, tokenPrice})'
```

## Save a fresh local snapshot

```bash
curl -fsSL https://prestocks.com/api/prestocks -o /tmp/prestocks.json
```

## Fetch from a browser console

```js
const rows = await fetch('https://prestocks.com/api/prestocks').then((r) => r.json())
rows.map(({ symbol, markPrice, tokenPrice }) => ({ symbol, markPrice, tokenPrice }))
```

## Calculate a premium/discount for one row

```js
const row = rows[0]
const gapPct = row.markPrice
  ? ((row.tokenPrice - row.markPrice) / row.markPrice) * 100
  : null
console.log(row.symbol, gapPct)
```
