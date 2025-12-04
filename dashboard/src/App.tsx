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
    <div className="min-h-screen p-4 md:p-8 max-w-6xl mx-auto font-sans">
      {/* HEADER */}
      <header className="flex flex-col lg:flex-row justify-between items-center mb-8 gap-6">
        <div className="text-center lg:text-left flex flex-col items-center lg:items-start gap-2">
          <div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-slate-400 text-sm mt-1">Signal Aggregator</p>
          </div>

          <NotificationButton />
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 min-h-[400px] content-start">
        {loading ? (
          <div className="col-span-full text-center py-20 text-slate-500 animate-pulse">
            Loading signals...
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
          <div className="col-span-full text-center py-20 text-slate-600 border border-dashed border-slate-800 rounded-xl">
            <p>Tidak ada sinyal di kategori ini.</p>
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
