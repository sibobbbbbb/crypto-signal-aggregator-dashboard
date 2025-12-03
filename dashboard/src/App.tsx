import { useState } from 'react'
import { useSignals } from './hooks/useSignals'
import { GlobalCalculator } from './components/dashboard/GlobalCalculator'
import { SignalCard } from './components/dashboard/SignalCard'

function App() {
  // Data State
  const { signals, loading } = useSignals()
  
  // UI State
  const [margin, setMargin] = useState<number>(5)
  const [leverage, setLeverage] = useState<number>(10)

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row justify-between items-center mb-8 gap-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
            Nexus Signal
          </h1>
          <p className="text-slate-400 text-sm mt-1">Modular Dashboard</p>
        </div>

        <GlobalCalculator 
          margin={margin} 
          leverage={leverage} 
          setMargin={setMargin} 
          setLeverage={setLeverage} 
        />
      </header>

      {/* Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500 animate-pulse">
            Loading signals...
          </div>
        ) : signals.map((signal) => (
          <SignalCard 
            key={signal.id} 
            data={signal} 
            margin={margin} 
            leverage={leverage} 
          />
        ))}
      </div>
    </div>
  )
}

export default App