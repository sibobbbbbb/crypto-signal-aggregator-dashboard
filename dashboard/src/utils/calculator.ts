import type { PnLResult } from '../types/signal'

export const calculatePnL = (
  entry: number,
  target: number | null,
  direction: 'LONG' | 'SHORT',
  margin: number,
  leverage: number
): PnLResult => {
  if (!target || !entry) return { usd: 0, pct: 0 }

  const size = margin * leverage
  const coins = size / entry
  
  let pnl = 0
  if (direction === 'LONG') {
    pnl = (target - entry) * coins
  } else {
    pnl = (entry - target) * coins
  }

  return {
    usd: pnl,
    pct: (pnl / margin) * 100
  }
}