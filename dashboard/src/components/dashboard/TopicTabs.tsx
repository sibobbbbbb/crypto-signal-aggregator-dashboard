import { Layers } from 'lucide-react'
import type { TopicConfig } from '../../utils/config'

interface Props {
  tabs: TopicConfig[];
  activeTab: number | 'ALL';
  onTabChange: (id: number | 'ALL') => void;
}

export const TopicTabs = ({ tabs, activeTab, onTabChange }: Props) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6 justify-center lg:justify-start">
      {/* ALL */}
      <button
        onClick={() => onTabChange('ALL')}
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
          activeTab === 'ALL' 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
        }`}
      >
        <div className="flex items-center gap-2">
          <Layers size={14} /> All Feeds
        </div>
      </button>

      {/* Tabs */}
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
            activeTab === tab.id 
              ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-500/30' 
              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
          }`}
        >
          {tab.name}
        </button>
      ))}
    </div>
  )
}