import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StatsPanelProps {
  stats: {
    total: number;
    incomplete: number;
    completed: number;
    progress: number;
  };
  isOpen: boolean;
  onToggle: () => void;
}

export function StatsPanel({ stats, isOpen, onToggle }: StatsPanelProps) {
  return (
    <div className={`bg-[#1a2332] border-l border-gray-800 flex flex-col transition-all duration-300 relative h-screen ${
      isOpen ? 'w-80' : 'w-16'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-6 w-6 h-6 bg-[#1a2332] border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-gray-300 hover:border-gray-600 transition-colors z-10"
      >
        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>

      {isOpen ? (
        <div className="p-6">
          {/* Stats Section - Progress removed */}
          <div>
            <h3 className="text-gray-100 mb-4">Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Total</span>
                <span className="text-gray-100">{stats.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Incomplete</span>
                <span className="text-gray-100">{stats.incomplete}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Completed</span>
                <span className="text-gray-100">{stats.completed}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 mt-16 p-2">
          {/* Collapsed view - just stats numbers */}
          <div className="flex flex-col items-center gap-2 text-xs text-gray-400">
            <div className="text-gray-300">{stats.total}</div>
            <div className="text-gray-500">total</div>
          </div>
        </div>
      )}
    </div>
  );
}