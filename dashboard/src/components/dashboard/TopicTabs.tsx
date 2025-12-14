import { Layers } from 'lucide-react'
import type { TopicConfig } from '../../utils/config'

interface Props {
  tabs: TopicConfig[];
  activeTab: number | 'ALL';
  onTabChange: (id: number | 'ALL') => void;
}

export const TopicTabs = ({ tabs, activeTab, onTabChange }: Props) => {
  return (
    <div className="mb-8">
      <div className="inline-flex flex-wrap gap-2 p-2 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800/60 rounded-xl">
        {/* ALL */}
        <button
          onClick={() => onTabChange('ALL')}
          className={`group relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
            activeTab === 'ALL' 
              ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 text-white shadow-lg shadow-emerald-500/30' 
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
          }`}
        >
          <div className="flex items-center gap-2">
            <Layers size={15} strokeWidth={2.5} />
            <span>All Feeds</span>
          </div>
        </button>

        {/* Tabs */}
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
              activeTab === tab.id 
                ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30' 
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
            }`}
          >
            {tab.name}
          </button>
        ))}
      </div>
    </div>
  )
}