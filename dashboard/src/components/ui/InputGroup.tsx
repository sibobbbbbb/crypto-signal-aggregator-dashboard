interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export const InputGroup = ({ label, value, onChange }: InputGroupProps) => (
  <div className="flex flex-col">
    <label className="text-[10px] text-slate-500 font-mono mb-1">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-slate-950 border border-slate-700 rounded px-2 py-1 w-20 text-center focus:outline-none focus:border-cyan-500 transition-colors font-mono font-bold"
    />
  </div>
)