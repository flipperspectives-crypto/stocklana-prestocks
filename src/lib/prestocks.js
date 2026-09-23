/** Pure PreStocks calculations and briefing selection helpers. */

/** Premium (+) / discount (−) of tokenPrice vs markPrice. */
export function premiumPct(tokenPrice, markPrice) {
  if (!markPrice || markPrice === 0) return null
  return ((tokenPrice - markPrice) / markPrice) * 100
}

export function fmtPct(p) {
  if (p == null || Number.isNaN(p)) return '—'
  const sign = p > 0 ? '+' : ''
  return `${sign}${p.toFixed(2)}%`
}

/** Return a new array with the largest absolute premium/discount first. */
export function sortByAbsGap(items) {
  return [...items].sort((a, b) => {
    const gapA = Math.abs(premiumPct(a.tokenPrice, a.markPrice) ?? 0)
    const gapB = Math.abs(premiumPct(b.tokenPrice, b.markPrice) ?? 0)
    return gapB - gapA
  })
}

/** Pick the largest positive and most negative gaps for the agent briefing. */
export function briefingPicks(items) {
  const withPct = items
    .map((item) => ({ item, pct: premiumPct(item.tokenPrice, item.markPrice) }))
    .filter(({ pct }) => pct != null)

  if (!withPct.length) {
    return { biggestPremium: null, biggestDiscount: null }
  }

  return {
    biggestPremium: withPct.reduce((a, b) => (b.pct > a.pct ? b : a)),
    biggestDiscount: withPct.reduce((a, b) => (b.pct < a.pct ? b : a)),
  }
}
