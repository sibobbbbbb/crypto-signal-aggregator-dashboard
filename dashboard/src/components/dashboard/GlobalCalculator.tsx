import { InputGroup } from '../ui/InputGroup'

interface Props {
  margin: number;
  leverage: number;
  setMargin: (v: number) => void;
  setLeverage: (v: number) => void;
}

export const GlobalCalculator = ({ margin, leverage, setMargin, setLeverage }: Props) => {
  return (
    <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 p-5 rounded-2xl flex flex-wrap items-center gap-6 shadow-xl">
      <InputGroup label="Margin ($)" value={margin} onChange={setMargin} />
      
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-800/50 text-zinc-600 font-bold text-lg">
        ✕
      </div>
      
      <InputGroup label="Leverage (x)" value={leverage} onChange={setLeverage} />
      
      <div className="h-12 w-px bg-zinc-800 mx-1 hidden md:block"></div>
      
      <div className="flex flex-col items-end min-w-[100px]">
        <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Position Size</span>
        <span className="font-bold text-2xl text-gradient-success">
          ${(margin * leverage).toFixed(0)}
        </span>
      </div>
    </div>
  )
}
