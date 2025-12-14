import { useState, useMemo } from "react";
import { useSignals } from "./hooks/useSignals";
import { getTopicConfig } from "./utils/config";
import { GlobalCalculator } from "./components/dashboard/GlobalCalculator";
import { SignalCard } from "./components/dashboard/SignalCard";
import { TopicTabs } from "./components/dashboard/TopicTabs";
import { Pagination } from "./components/dashboard/Pagination";
import { NotificationButton } from "./components/ui/NotificationButton";

function App() {
  // Data Layer
  const { signals, loading } = useSignals();
  const tabs = useMemo(() => getTopicConfig(), []);

  // UI State
  const [margin, setMargin] = useState<number>(5);
  const [leverage, setLeverage] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<number | "ALL">("ALL");
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 5;

  // Logic Layer (Filtering & Pagination)
  const filteredSignals = useMemo(() => {
    if (activeTab === "ALL") return signals;
    return signals.filter((s) => s.topic_id === activeTab);
  }, [signals, activeTab]);

  const paginatedSignals = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSignals.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredSignals, currentPage]);

  const totalPages = Math.ceil(filteredSignals.length / ITEMS_PER_PAGE);

  // Handler Change Tab
  const handleTabChange = (id: number | "ALL") => {
    setActiveTab(id);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-7xl mx-auto">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 gap-8">
        <div className="flex flex-col gap-4 flex-1">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold tracking-tight text-gradient-success">
              Signal Dashboard
            </h1>
            <NotificationButton />
          </div>
          <p className="text-zinc-400 text-sm max-w-xl leading-relaxed">
            Monitor real-time crypto trading signals with advanced position calculations
          </p>
        </div>

        <GlobalCalculator
          margin={margin}
          leverage={leverage}
          setMargin={setMargin}
          setLeverage={setLeverage}
        />
      </header>

      {/* TABS NAVIGATION */}
      <TopicTabs
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* SIGNAL GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 min-h-[500px] content-start">
        {loading ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 gap-4">
            <div className="w-12 h-12 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
            <p className="text-zinc-500 text-sm font-medium animate-pulse">Loading signals...</p>
          </div>
        ) : paginatedSignals.length > 0 ? (
          paginatedSignals.map((signal) => (
            <SignalCard
              key={signal.id}
              data={signal}
              margin={margin}
              leverage={leverage}
            />
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-32 gap-3 border-2 border-dashed border-zinc-800 rounded-2xl">
            <div className="text-4xl opacity-20">📊</div>
            <p className="text-zinc-500 font-medium">Tidak ada sinyal di kategori ini</p>
            <p className="text-zinc-600 text-sm">Coba pilih kategori lain atau tunggu sinyal baru</p>
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}

export default App;
