import { CheckSquare, Square, CheckCircle, ChevronLeft, ChevronRight, Calendar, CalendarDays, CalendarRange, Clock, ListTodo, Tag, Moon, Sun } from 'lucide-react';
import type { Category } from '../App';

type DateFilterType = 'today' | 'tomorrow' | 'week' | 'all' | 'unscheduled' | number;

interface SidebarProps {
  stats: {
    total: number;
    incomplete: number;
    completed: number;
    progress: number;
  };
  filter: 'all' | 'incomplete' | 'completed';
  onFilterChange: (filter: 'all' | 'incomplete' | 'completed') => void;
  onClearCompleted: () => void;
  isOpen: boolean;
  onToggle: () => void;
  dateFilter?: DateFilterType;
  onDateFilterChange?: (filter: DateFilterType) => void;
  categories?: Category[];
  categoryFilter?: string | null;
  onCategoryFilterChange?: (categoryId: string | null) => void;
  darkMode?: boolean;
  onDarkModeToggle?: () => void;
}

export function Sidebar({ 
  stats, 
  filter, 
  onFilterChange, 
  onClearCompleted, 
  isOpen, 
  onToggle, 
  dateFilter = 'today', 
  onDateFilterChange,
  categories = [],
  categoryFilter,
  onCategoryFilterChange,
  darkMode = true,
  onDarkModeToggle 
}: SidebarProps) {
  return (
    <div 
      className={`border-r border-border bg-sidebar flex flex-col transition-all duration-300 relative h-screen ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      {/* Toggle Button - hidden on mobile */}
      <button
        onClick={onToggle}
        className="hidden lg:flex absolute -right-3 top-6 w-6 h-6 bg-secondary border border-border rounded-full items-center justify-center text-muted-foreground hover:text-foreground hover:border-muted-foreground transition-colors z-10"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>

      {/* Logo */}
      <div className={`border-b border-border ${isOpen ? 'p-6' : 'p-4 flex justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-6 h-6 text-white" />
          </div>
          {isOpen && (
            <div className="overflow-hidden">
              <h2 className="text-sidebar-foreground">TaskMate</h2>
              <p className="text-muted-foreground text-sm">Stay organized</p>
            </div>
          )}
        </div>
      </div>

      {/* Progress Percentage Badge - Only shown when collapsed */}
      {!isOpen && (
        <div className="p-2 flex justify-center border-b border-border">
          <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg px-2 py-1.5 flex items-center justify-center">
            <span className="text-blue-400 text-sm">{stats.progress}%</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto ${isOpen ? 'p-4' : 'p-2'}`}>
        {/* Date Filters Section */}
        {isOpen && onDateFilterChange && (
          <div className="mb-4">
            <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-2 px-2">Schedule</h3>
            <button
              onClick={() => onDateFilterChange('today')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                dateFilter === 'today'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Calendar className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Today</span>
            </button>

            <button
              onClick={() => onDateFilterChange('tomorrow')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                dateFilter === 'tomorrow'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <CalendarDays className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Tomorrow</span>
            </button>

            <button
              onClick={() => onDateFilterChange('week')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                dateFilter === 'week'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <CalendarRange className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">This Week</span>
            </button>

            <button
              onClick={() => onDateFilterChange('unscheduled')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                dateFilter === 'unscheduled'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">Unscheduled</span>
            </button>

            <button
              onClick={() => onDateFilterChange('all')}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                dateFilter === 'all'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <ListTodo className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">All Days</span>
            </button>
          </div>
        )}

        {/* Status Filters Section */}
        {isOpen && <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-2 px-2">Status</h3>}

        <button
          onClick={() => onFilterChange('all')}
          className={`w-full flex items-center justify-center rounded-lg mb-2 transition-colors ${
            isOpen ? 'gap-3 px-4 py-3' : 'p-3 aspect-square'
          } ${
            filter === 'all'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
          }`}
          title={isOpen ? '' : 'All Tasks'}
        >
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center text-sm flex-shrink-0">
            📋
          </div>
          {isOpen && (
            <>
              <span className="flex-1 text-left">All Tasks</span>
              <span className="text-sm">{stats.total}</span>
            </>
          )}
        </button>

        <button
          onClick={() => onFilterChange('incomplete')}
          className={`w-full flex items-center justify-center rounded-lg mb-2 transition-colors ${
            isOpen ? 'gap-3 px-4 py-3' : 'p-3 aspect-square'
          } ${
            filter === 'incomplete'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
          }`}
          title={isOpen ? '' : 'Incomplete'}
        >
          <Square className="w-5 h-5 flex-shrink-0" />
          {isOpen && (
            <>
              <span className="flex-1 text-left">Incomplete</span>
              <span className="text-sm">{stats.incomplete}</span>
            </>
          )}
        </button>

        <button
          onClick={() => onFilterChange('completed')}
          className={`w-full flex items-center justify-center rounded-lg transition-colors ${
            isOpen ? 'gap-3 px-4 py-3' : 'p-3 aspect-square'
          } ${
            filter === 'completed'
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
          }`}
          title={isOpen ? '' : 'Completed'}
        >
          <CheckCircle className={`w-5 h-5 flex-shrink-0 ${filter === 'completed' ? 'text-green-400' : 'text-green-500'}`} />
          {isOpen && (
            <>
              <span className="flex-1 text-left">Completed</span>
              <span className="text-sm">{stats.completed}</span>
            </>
          )}
        </button>

        {/* Category Filters Section */}
        {isOpen && categories.length > 0 && (
          <div className="mb-4">
            <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-2 px-2">Categories</h3>
            <button
              onClick={() => onCategoryFilterChange?.(null)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                categoryFilter === null
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              <Tag className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">All Categories</span>
            </button>

            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => onCategoryFilterChange?.(category.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                  categoryFilter === category.id
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                    : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
                }`}
              >
                <Tag className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Dark Mode Toggle */}
        {isOpen && onDarkModeToggle && (
          <div className="mb-4">
            <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-2 px-2">Appearance</h3>
            <button
              onClick={onDarkModeToggle}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg mb-1 transition-colors ${
                darkMode
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground'
              }`}
            >
              {darkMode ? <Moon className="w-4 h-4 flex-shrink-0" /> : <Sun className="w-4 h-4 flex-shrink-0" />}
              <span className="flex-1 text-left text-sm">{darkMode ? 'Dark Mode' : 'Light Mode'}</span>
            </button>
          </div>
        )}
      </nav>

      {/* Progress Bar */}
      <div className={`border-t border-border ${isOpen ? 'p-4' : 'p-2'}`}>
        {isOpen ? (
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-muted-foreground text-sm">Overall Progress</span>
              <span className="text-sidebar-foreground">{stats.progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${stats.progress}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
              <span>{stats.completed} completed</span>
              <span>{stats.incomplete} remaining</span>
            </div>
          </div>
        ) : (
          null
        )}
      </div>

      {/* Collapse Toggle */}
      {!isOpen && (
        <div className="p-2 flex justify-center border-t border-border">
          <button
            onClick={onToggle}
            className="text-muted-foreground hover:text-sidebar-foreground transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}