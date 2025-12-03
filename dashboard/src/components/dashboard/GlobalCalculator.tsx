import { InputGroup } from '../ui/InputGroup'

interface Props {
  margin: number;
  leverage: number;
  setMargin: (v: number) => void;
  setLeverage: (v: number) => void;
}

export const GlobalCalculator = ({ margin, leverage, setMargin, setLeverage }: Props) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur p-4 rounded-xl border border-slate-800 flex gap-6 items-center shadow-xl">
      <InputGroup label="Margin ($)" value={margin} onChange={setMargin} />
      <span className="text-slate-600 font-bold">✕</span>
      <InputGroup label="Lev (x)" value={leverage} onChange={setLeverage} />
      
      <div className="h-10 w-px bg-slate-700 mx-2 hidden md:block"></div>
      
      <div className="flex flex-col items-end min-w-[80px]">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider">Position Size</span>
        <span className="font-bold text-xl text-emerald-400">
          ${(margin * leverage).toFixed(0)}
        </span>
      </div>
    </div>
  )
}