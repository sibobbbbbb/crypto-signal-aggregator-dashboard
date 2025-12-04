export interface Signal {
  id: number;
  created_at: string;
  topic_id: number;
  coin_symbol: string;
  direction: 'LONG' | 'SHORT';
  entry_price: number;
  sl_price: number;
  tp_targets: number[];
  raw_message: string;
}

export interface PnLResult {
  usd: number;
  pct: number;
}