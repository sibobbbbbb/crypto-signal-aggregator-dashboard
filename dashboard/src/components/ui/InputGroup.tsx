interface InputGroupProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
}

export const InputGroup = ({ label, value, onChange }: InputGroupProps) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[11px] text-zinc-500 font-semibold uppercase tracking-widest">{label}</label>
    <input 
      type="number" 
      value={value} 
      onChange={(e) => onChange(Number(e.target.value))}
      className="bg-zinc-950/80 border-2 border-zinc-800 hover:border-zinc-700 focus:border-indigo-500 rounded-lg px-3 py-2 w-24 text-center focus:outline-none transition-all duration-200 font-mono font-bold text-zinc-100 text-base"
    />
  </div>
)