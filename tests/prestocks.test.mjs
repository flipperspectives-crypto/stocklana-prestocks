import test from 'node:test'
import assert from 'node:assert/strict'
import { briefingPicks, premiumPct, sortByAbsGap } from '../src/lib/prestocks.js'

test('premiumPct calculates premiums, discounts, and zero-mark nulls', () => {
  assert.equal(premiumPct(12, 10), 20)
  assert.equal(premiumPct(8, 10), -20)
  assert.equal(premiumPct(12, 0), null)
})

test('sortByAbsGap puts the largest absolute gaps first without mutating input', () => {
  const fixture = [
    { symbol: 'SMALL', tokenPrice: 10.5, markPrice: 10 },
    { symbol: 'PREM', tokenPrice: 13, markPrice: 10 },
    { symbol: 'DISC', tokenPrice: 4, markPrice: 10 },
  ]

  const sorted = sortByAbsGap(fixture)
  assert.deepEqual(sorted.map(({ symbol }) => symbol), ['DISC', 'PREM', 'SMALL'])
  assert.deepEqual(fixture.map(({ symbol }) => symbol), ['SMALL', 'PREM', 'DISC'])
})

test('briefingPicks selects the biggest premium and biggest discount', () => {
  const { biggestPremium, biggestDiscount } = briefingPicks([
    { symbol: 'ALPHA', tokenPrice: 11, markPrice: 10 },
    { symbol: 'BETA', tokenPrice: 16, markPrice: 10 },
    { symbol: 'GAMMA', tokenPrice: 6, markPrice: 10 },
  ])

  assert.equal(biggestPremium.item.symbol, 'BETA')
  assert.equal(biggestPremium.pct, 60)
  assert.equal(biggestDiscount.item.symbol, 'GAMMA')
  assert.equal(biggestDiscount.pct, -40)
})
