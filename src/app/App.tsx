import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ListTodo, ListChecks, List, Filter, Moon, Sun } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { CompletionCelebration } from './components/CompletionCelebration';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { Toaster } from "sonner";
import { useTasksLocal } from './hooks/useTasksLocal';
import { useCategoriesLocal } from './hooks/useCategoriesLocal';

export interface Category {
  id: string;
  name: string;
  color: string;
}

export interface Task {
  id: string;
  text: string;
  comment?: string;
  completed: boolean;
  createdAt: number;
  dueDate?: number;
  scheduledDate?: number;
  categoryId?: string;
  order: number;
}

type FilterType = 'all' | 'incomplete' | 'completed';
type SortType = 'a-z' | 'z-a' | 'newest' | 'oldest' | 'manual';
type DateFilterType = 'today' | 'tomorrow' | 'week' | 'all' | 'unscheduled' | number;

export default function App() {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('manual');
  const [quickAddInput, setQuickAddInput] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false);
  const [hasShownCelebration, setHasShownCelebration] = useState(false);
  const [dateFilter, setDateFilter] = useState<DateFilterType>('today');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(true);

  // Use localStorage hooks instead of Supabase
  const { tasks, loading: tasksLoading, addTask, toggleTask, deleteTask, editTask, clearCompleted, moveTask } = useTasksLocal();
  const { categories, loading: categoriesLoading } = useCategoriesLocal();

  // Load preferences from localStorage
  useEffect(() => {
    const savedDateFilter = localStorage.getItem('taskmate_dateFilter');
    const savedDarkMode = localStorage.getItem('taskmate_darkMode');

    if (savedDateFilter) {
      try {
        setDateFilter(JSON.parse(savedDateFilter));
      } catch (e) {
        console.error('Failed to load date filter:', e);
      }
    }

    if (savedDarkMode !== null) {
      try {
        setDarkMode(JSON.parse(savedDarkMode));
      } catch (e) {
        console.error('Failed to load dark mode:', e);
      }
    }
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    localStorage.setItem('taskmate_dateFilter', JSON.stringify(dateFilter));
  }, [dateFilter]);

  useEffect(() => {
    localStorage.setItem('taskmate_darkMode', JSON.stringify(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Apply date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
      const todayEnd = todayStart + 24 * 60 * 60 * 1000;
      const tomorrowStart = todayEnd;
      const tomorrowEnd = tomorrowStart + 24 * 60 * 60 * 1000;
      const weekEnd = todayStart + 7 * 24 * 60 * 60 * 1000;

      if (dateFilter === 'today') {
        filtered = filtered.filter((task) => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= todayStart && scheduledTime < todayEnd;
        });
      } else if (dateFilter === 'tomorrow') {
        filtered = filtered.filter((task) => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= tomorrowStart && scheduledTime < tomorrowEnd;
        });
      } else if (dateFilter === 'week') {
        filtered = filtered.filter((task) => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= todayStart && scheduledTime < weekEnd;
        });
      } else if (dateFilter === 'unscheduled') {
        filtered = filtered.filter((task) => !task.scheduledDate);
      } else if (typeof dateFilter === 'number') {
        const filterStart = new Date(dateFilter);
        filterStart.setHours(0, 0, 0, 0);
        const filterEnd = filterStart.getTime() + 24 * 60 * 60 * 1000;
        filtered = filtered.filter((task) => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= filterStart.getTime() && scheduledTime < filterEnd;
        });
      }
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter((task) => task.categoryId === categoryFilter);
    }

    // Apply status filter
    if (filter === 'incomplete') {
      filtered = filtered.filter((task) => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter((task) =>
        task.text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply sort
    const sorted = [...filtered];
    switch (sortType) {
      case 'a-z':
        sorted.sort((a, b) => a.text.localeCompare(b.text));
        break;
      case 'z-a':
        sorted.sort((a, b) => b.text.localeCompare(a.text));
        break;
      case 'newest':
        sorted.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case 'oldest':
        sorted.sort((a, b) => a.createdAt - b.createdAt);
        break;
      case 'manual':
        sorted.sort((a, b) => a.order - b.order);
        break;
    }

    return sorted;
  }, [tasks, filter, searchQuery, sortType, dateFilter, categoryFilter]);

  const stats = useMemo(() => {
    const tasksToCount = dateFilter !== 'all' ? filteredTasks : tasks;
    const total = tasksToCount.length;
    const completed = tasksToCount.filter((t) => t.completed).length;
    const incomplete = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, incomplete, progress };
  }, [tasks, filteredTasks, dateFilter]);

  // Check for completion celebration
  useEffect(() => {
    if (stats.progress === 100 && stats.total > 0 && !hasShownCelebration) {
      setShowCelebration(true);
      setHasShownCelebration(true);
    }

    if (stats.progress < 100) {
      setHasShownCelebration(false);
    }
  }, [stats.progress, stats.total, hasShownCelebration]);

  const handleQuickAdd = () => {
    if (quickAddInput.trim()) {
      // Auto-schedule based on current filter
      let scheduledDate: number | undefined;
      if (dateFilter !== 'all' && dateFilter !== 'unscheduled') {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

        if (dateFilter === 'today') {
          scheduledDate = todayStart;
        } else if (dateFilter === 'tomorrow') {
          scheduledDate = todayStart + 24 * 60 * 60 * 1000;
        } else if (typeof dateFilter === 'number') {
          scheduledDate = dateFilter;
        }
      }

      addTask(quickAddInput, undefined, undefined, scheduledDate);
      setQuickAddInput('');
    }
  };

  const handleQuickAddKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAdd();
    }
  };

  const handleModalAdd = (text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    // Auto-schedule if not provided
    let finalScheduledDate = scheduledDate;
    if (!finalScheduledDate && dateFilter !== 'all' && dateFilter !== 'unscheduled') {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();

      if (dateFilter === 'today') {
        finalScheduledDate = todayStart;
      } else if (dateFilter === 'tomorrow') {
        finalScheduledDate = todayStart + 24 * 60 * 60 * 1000;
      } else if (typeof dateFilter === 'number') {
        finalScheduledDate = dateFilter;
      }
    }

    addTask(text, comment, dueDate, finalScheduledDate, categoryId);
    setShowAddModal(false);
  };

  const handleEdit = (id: string, text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    editTask(id, text, comment, dueDate, scheduledDate, categoryId);
    setEditingTask(null);
  };

  const handleMove = (dragIndex: number, hoverIndex: number) => {
    moveTask(dragIndex, hoverIndex, filteredTasks);
  };

  // Detect touch device
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;

  // Show loading screen
  if (tasksLoading || categoriesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading TaskMate...</p>
        </div>
      </div>
    );
  }

  return (
    <DndProvider backend={dndBackend}>
      <div className={`flex flex-col lg:flex-row h-screen overflow-hidden pb-16 lg:pb-0 ${darkMode ? 'dark' : ''}`}>
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <Sidebar
            stats={stats}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={clearCompleted}
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(!sidebarOpen)}
            dateFilter={dateFilter}
            onDateFilterChange={setDateFilter}
            categories={categories}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            darkMode={darkMode}
            onDarkModeToggle={() => setDarkMode(!darkMode)}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-border px-4 py-3 flex items-center justify-between relative bg-card">
            <div className="flex items-center gap-2">
              <h2 className="text-foreground">TaskMate</h2>
            </div>
            <h2 className="text-foreground text-center absolute left-1/2 -translate-x-1/2">
              {dateFilter === 'today' && 'Today'}
              {dateFilter === 'tomorrow' && 'Tomorrow'}
              {dateFilter === 'week' && 'This Week'}
              {dateFilter === 'unscheduled' && 'Unscheduled'}
              {dateFilter === 'all' && 'All Days'}
              {typeof dateFilter === 'number' && new Date(dateFilter).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="bg-secondary hover:bg-accent text-foreground rounded-lg p-2 transition-colors"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="bg-secondary hover:bg-accent text-foreground rounded-lg p-2 transition-colors">
                    <Filter className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-card border-border w-64">
                  <SheetHeader>
                    <SheetTitle className="text-foreground">Filters</SheetTitle>
                    <SheetDescription className="text-muted-foreground">
                      Filter tasks by schedule
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    {/* Date Filters */}
                    <div>
                      <h3 className="text-muted-foreground text-xs uppercase tracking-wider mb-2">Schedule</h3>
                      <div className="space-y-1">
                        <button
                          onClick={() => setDateFilter('today')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            dateFilter === 'today'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <span className="text-sm">Today</span>
                        </button>
                        <button
                          onClick={() => setDateFilter('tomorrow')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            dateFilter === 'tomorrow'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <span className="text-sm">Tomorrow</span>
                        </button>
                        <button
                          onClick={() => setDateFilter('week')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            dateFilter === 'week'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <span className="text-sm">This Week</span>
                        </button>
                        <button
                          onClick={() => setDateFilter('unscheduled')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            dateFilter === 'unscheduled'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <span className="text-sm">Unscheduled</span>
                        </button>
                        <button
                          onClick={() => setDateFilter('all')}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                            dateFilter === 'all'
                              ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                              : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                          }`}
                        >
                          <span className="text-sm">All Days</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg p-2"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Header - Desktop */}
          <div className="hidden lg:block border-b border-border px-4 lg:px-8 py-4 lg:py-6 bg-background">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-foreground">My Tasks</h1>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Sort Dropdown */}
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="bg-secondary border border-border rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-blue-500"
              >
                <option value="manual">Manual Order</option>
                <option value="a-z">Sort A→Z</option>
                <option value="z-a">Sort Z→A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              {/* Add Task Button */}
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>

          {/* Mobile Search and Sort */}
          <div className="lg:hidden space-y-3">
            {/* Mobile Progress Bar */}
            <div className="border-b border-border px-4 py-3 bg-card">
              <div className="flex items-center justify-between mb-2">
                <span className="text-muted-foreground text-sm">Progress</span>
                <span className="text-foreground">{stats.progress}%</span>
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

            {/* Search and Sort */}
            <div className="border-b border-border px-4 pb-3 space-y-3 bg-background">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 text-foreground focus:outline-none focus:border-blue-500"
              >
                <option value="manual">Manual Order</option>
                <option value="a-z">Sort A→Z</option>
                <option value="z-a">Sort Z→A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Quick Add */}
          <div className="hidden lg:block px-4 lg:px-8 py-4 border-b border-border bg-background">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Add a task quickly... (press Enter)"
                value={quickAddInput}
                onChange={(e) => setQuickAddInput(e.target.value)}
                onKeyPress={handleQuickAddKeyPress}
                className="flex-1 bg-transparent text-muted-foreground placeholder-muted-foreground focus:outline-none"
              />
              <button
                onClick={handleQuickAdd}
                className="text-blue-400 hover:text-blue-300 transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Task List */}
          <TaskList
            tasks={filteredTasks}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onEdit={setEditingTask}
            onMove={handleMove}
            canDragDrop={sortType === 'manual'}
            categories={categories}
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border flex items-center justify-around py-3 px-4 z-30">
          <button
            onClick={() => setFilter('all')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'all' ? 'text-blue-500' : 'text-muted-foreground'
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-xs">All</span>
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'incomplete' ? 'text-blue-500' : 'text-muted-foreground'
            }`}
          >
            <ListTodo className="w-6 h-6" />
            <span className="text-xs">Active</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'completed' ? 'text-blue-500' : 'text-muted-foreground'
            }`}
          >
            <ListChecks className="w-6 h-6" />
            <span className="text-xs">Done</span>
          </button>
          {stats.completed > 0 && (
            <button
              onClick={clearCompleted}
              className="flex flex-col items-center gap-1 flex-1 text-red-400"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
              <span className="text-xs">Clear</span>
            </button>
          )}
        </div>

        {/* Add Task Modal */}
        {showAddModal && (
          <AddTaskModal
            onAdd={handleModalAdd}
            onClose={() => setShowAddModal(false)}
            currentDateFilter={dateFilter}
            categories={categories}
          />
        )}

        {/* Edit Task Modal */}
        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onEdit={handleEdit}
            onClose={() => setEditingTask(null)}
            categories={categories}
          />
        )}

        {/* Completion Celebration */}
        {showCelebration && <CompletionCelebration onDismiss={() => setShowCelebration(false)} />}

        {/* Toast Notifications */}
        <Toaster theme={darkMode ? "dark" : "light"} position="bottom-right" richColors />
      </div>
    </DndProvider>
  );
}