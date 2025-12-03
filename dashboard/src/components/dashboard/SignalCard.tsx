import { ArrowUpCircle, ArrowDownCircle, TrendingUp, AlertTriangle } from 'lucide-react'
import type { Signal } from '../../types/signal'
import { calculatePnL } from '../../utils/calculator'

interface Props {
  data: Signal;
  margin: number;
  leverage: number;
}

export const SignalCard = ({ data, margin, leverage }: Props) => {
  const isLong = data.direction === 'LONG'
  const sl = calculatePnL(data.entry_price, data.sl_price, data.direction, margin, leverage)

  return (
    <div className="bg-slate-900 border border-slate-800/60 rounded-xl p-5 hover:border-cyan-500/30 transition-all hover:-translate-y-1 shadow-lg group">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${isLong ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
            {isLong ? <ArrowUpCircle size={20} /> : <ArrowDownCircle size={20} />}
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight tracking-tight">{data.coin_symbol}</h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide ${isLong ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'}`}>
              {data.direction}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-slate-500 uppercase">Entry</p>
          <p className="font-mono font-medium text-slate-200">{data.entry_price}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
        {/* SL Logic */}
        <div className="flex justify-between items-center text-xs group/row">
          <div className="flex items-center gap-1.5 text-slate-400">
            <AlertTriangle size={12} className="text-rose-500" />
            <span>SL <span className="text-[10px] opacity-50">({data.sl_price})</span></span>
          </div>
          <span className={`font-mono ${sl.usd < 0 ? 'text-rose-400' : 'text-slate-400'}`}>
            ${sl.usd.toFixed(2)} ({sl.pct.toFixed(1)}%)
          </span>
        </div>

        <div className="h-px bg-slate-800/50 my-1"></div>

        {/* TP Logic Loop */}
        {data.tp_targets?.map((tp, idx) => {
          const tpCalc = calculatePnL(data.entry_price, tp, data.direction, margin, leverage)
          return (
            <div key={idx} className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-1.5 text-slate-400">
                <TrendingUp size={12} className="text-emerald-500" />
                <span>TP{idx + 1} <span className="text-[10px] opacity-50">({tp})</span></span>
              </div>
              <span className="font-mono text-emerald-400">
                +${tpCalc.usd.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
      
      <a 
        href={`https://www.binance.com/en/futures/${data.coin_symbol}USDT`} 
        target="_blank" 
        rel="noreferrer"
        className="mt-4 flex items-center justify-center w-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs py-2.5 rounded-lg transition-colors font-medium"
      >
        Open Chart
      </a>
    </div>
  )
}