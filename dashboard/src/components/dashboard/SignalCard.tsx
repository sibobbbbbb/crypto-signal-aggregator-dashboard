import { ArrowUpCircle, ArrowDownCircle, TrendingUp, AlertTriangle, Clock, ExternalLink } from 'lucide-react'
import type { Signal } from '../../types/signal'
import { calculatePnL } from '../../utils/calculator'
import { formatIndoDate } from '../../utils/dateFormat'

interface Props {
  data: Signal;
  margin: number;
  leverage: number;
}

export const SignalCard = ({ data, margin, leverage }: Props) => {
  const isLong = data.direction === 'LONG'
  const sl = calculatePnL(data.entry_price, data.sl_price, data.direction, margin, leverage)

  return (
    <div className="group relative bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 animate-fade-in overflow-hidden">
      
      {/* Subtle gradient glow - warm for LONG, cool for SHORT */}
      <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
        isLong 
          ? 'bg-gradient-to-br from-orange-500/5 via-transparent to-amber-500/5' 
          : 'bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5'
      }`}></div>

      {/* Timestamp */}
      <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 mb-5 pb-3 border-b border-zinc-800/50 relative z-10">
        <Clock size={13} className="text-zinc-600" strokeWidth={2.5} />
        <span className="tracking-wide">{formatIndoDate(data.created_at)}</span>
      </div>

      {/* Main Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3.5">
          <div className={`p-3 rounded-xl transition-all duration-300 ${
            isLong 
              ? 'bg-gradient-to-br from-orange-500/15 to-amber-500/10 text-orange-400 ring-1 ring-orange-500/20 group-hover:ring-orange-500/40' 
              : 'bg-gradient-to-br from-violet-500/15 to-purple-500/10 text-violet-400 ring-1 ring-violet-500/20 group-hover:ring-violet-500/40'
          }`}>
            {isLong ? <ArrowUpCircle size={22} strokeWidth={2.5} /> : <ArrowDownCircle size={22} strokeWidth={2.5} />}
          </div>
          <div>
            <h3 className="font-bold text-xl leading-tight tracking-tight text-zinc-100 mb-1.5">{data.coin_symbol}</h3>
            <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-md tracking-wide ${
              isLong 
                ? 'bg-orange-500/15 text-orange-300 ring-1 ring-orange-500/20' 
                : 'bg-violet-500/15 text-violet-300 ring-1 ring-violet-500/20'
            }`}>
              {data.direction}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Entry</p>
          <p className="font-mono font-bold text-xl text-zinc-100">{data.entry_price}</p>
        </div>
      </div>

      {/* Calculator Stats */}
      <div className="space-y-3 bg-zinc-950/60 backdrop-blur-sm p-4 rounded-xl border border-zinc-800/40 relative z-10 mb-5">
        {/* SL Logic */}
        <div className="flex justify-between items-center text-sm group/row">
          <div className="flex items-center gap-2 text-zinc-400">
            <div className="p-1.5 bg-red-500/10 rounded-md">
              <AlertTriangle size={13} className="text-red-400" strokeWidth={2.5} />
            </div>
            <span className="font-medium">SL <span className="text-xs opacity-60 font-mono ml-1">({data.sl_price})</span></span>
          </div>
          <span className={`font-mono font-semibold tabular-nums ${sl.usd < 0 ? 'text-red-400' : 'text-zinc-400'}`}>
            ${sl.usd.toFixed(2)} <span className="text-xs opacity-75">({sl.pct.toFixed(1)}%)</span>
          </span>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-zinc-800/50 to-transparent"></div>

        {/* TP Logic Loop */}
        {data.tp_targets?.map((tp, idx) => {
          const tpCalc = calculatePnL(data.entry_price, tp, data.direction, margin, leverage)
          return (
            <div key={idx} className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2 text-zinc-400">
                <div className="p-1.5 bg-emerald-500/10 rounded-md">
                  <TrendingUp size={13} className="text-emerald-400" strokeWidth={2.5} />
                </div>
                <span className="font-medium">TP{idx + 1} <span className="text-xs opacity-60 font-mono ml-1">({tp})</span></span>
              </div>
              <span className="font-mono font-semibold text-emerald-400 tabular-nums">
                +${tpCalc.usd.toFixed(2)}
              </span>
            </div>
          )
        })}
      </div>
      
      {/* Footer Action */}
      <a 
        href={`https://www.binance.com/en/futures/${data.coin_symbol}USDT`} 
        target="_blank" 
        rel="noreferrer"
        className="group/btn relative flex items-center justify-center gap-2 w-full bg-gradient-to-r from-zinc-800 to-zinc-800/80 hover:from-zinc-700 hover:to-zinc-700/80 text-zinc-100 text-sm font-semibold py-3 rounded-xl transition-all duration-300 overflow-hidden z-10 border border-zinc-700/50 hover:border-zinc-600"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></div>
        <ExternalLink size={16} strokeWidth={2.5} className="relative z-10 group-hover/btn:rotate-12 transition-transform duration-300" />
        <span className="relative z-10">Open Chart</span>
      </a>
    </div>
  )
}
