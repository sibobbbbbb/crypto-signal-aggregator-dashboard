import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-6 mt-12 pt-8 border-t border-zinc-800/50">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="group p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900/50 transition-all duration-200 shadow-lg disabled:shadow-none"
      >
        <ChevronLeft size={20} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
      </button>
      
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                page === currentPage 
                  ? 'bg-indigo-500 w-8' 
                  : 'bg-zinc-700 hover:bg-zinc-600'
              }`}
            />
          ))}
        </div>
        <span className="text-zinc-500 text-sm font-medium">
          Page <span className="text-zinc-200 font-bold">{currentPage}</span> of {totalPages}
        </span>
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="group p-3 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-800 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-zinc-800 disabled:hover:bg-zinc-900/50 transition-all duration-200 shadow-lg disabled:shadow-none"
      >
        <ChevronRight size={20} strokeWidth={2.5} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
      </button>
    </div>
  )
}