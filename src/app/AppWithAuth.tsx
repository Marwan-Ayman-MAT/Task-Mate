import { useState, useMemo, useEffect } from 'react';
import { Search, Plus, ListTodo, ListChecks, List, Filter, Moon, Sun, LogOut } from 'lucide-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { Sidebar } from './components/Sidebar';
import { TaskList } from './components/TaskList';
import { AddTaskModal } from './components/AddTaskModal';
import { EditTaskModal } from './components/EditTaskModal';
import { CompletionCelebration } from './components/CompletionCelebration';
import { LoginPage } from './components/Auth/LoginPage';
import { SignupPage } from './components/Auth/SignupPage';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from './components/ui/sheet';
import { toast, Toaster } from 'sonner@2.0.3';
import { getTheme } from './utils/theme';
import { signIn, signOut, getSession } from './utils/supabase/client';
import * as api from './utils/api';
import { signUp } from './utils/api';

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
type AuthView = 'login' | 'signup';

export default function App() {
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authView, setAuthView] = useState<AuthView>('login');
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // App state
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
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

  // Check for existing session on mount
  useEffect(() => {
    checkSession();
  }, []);

  async function checkSession() {
    try {
      const { session, error } = await getSession();
      if (error) throw error;
      
      if (session && session.access_token) {
        setAccessToken(session.access_token);
        setIsAuthenticated(true);
        await loadUserData(session.access_token);
      }
    } catch (error) {
      console.error('Session check error:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function loadUserData(token: string) {
    try {
      // Load tasks
      const { data: tasksData, error: tasksError } = await api.fetchTasks(token);
      if (tasksError) throw new Error(tasksError);
      if (tasksData) setTasks(tasksData);

      // Load categories
      const { data: categoriesData, error: categoriesError } = await api.fetchCategories(token);
      if (categoriesError) throw new Error(categoriesError);
      if (categoriesData) setCategories(categoriesData);

      // Load preferences
      const { data: prefsData } = await api.fetchPreferences(token);
      if (prefsData) {
        if (prefsData.dark_mode !== undefined) setDarkMode(prefsData.dark_mode);
        if (prefsData.date_filter) setDateFilter(prefsData.date_filter);
        if (prefsData.sidebar_open !== undefined) setSidebarOpen(prefsData.sidebar_open);
      }

      toast.success('Welcome back!');
    } catch (error) {
      console.error('Load user data error:', error);
      toast.error('Failed to load data');
    }
  }

  async function handleLogin(email: string, password: string) {
    try {
      const { data, error } = await signIn(email, password);
      if (error) throw new Error(error.message);
      
      if (data.session && data.session.access_token) {
        setAccessToken(data.session.access_token);
        setIsAuthenticated(true);
        await loadUserData(data.session.access_token);
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
      throw error;
    }
  }

  async function handleSignup(email: string, password: string, name: string) {
    try {
      const { error: signupError } = await signUp(email, password, name);
      if (signupError) throw new Error(signupError);

      // Auto login after signup
      await handleLogin(email, password);
      toast.success('Account created successfully!');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error instanceof Error ? error.message : 'Signup failed');
      throw error;
    }
  }

  async function handleLogout() {
    try {
      await signOut();
      setIsAuthenticated(false);
      setAccessToken(null);
      setTasks([]);
      setCategories([]);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Logout failed');
    }
  }

  // Save preferences when they change
  useEffect(() => {
    if (isAuthenticated && accessToken) {
      api.updatePreferences(accessToken, { dark_mode: darkMode, date_filter: dateFilter, sidebar_open: sidebarOpen });
    }
  }, [darkMode, dateFilter, sidebarOpen, isAuthenticated, accessToken]);

  // Apply dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addTask = async (text: string, comment?: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    if (!text.trim() || !accessToken) return;
    
    // Determine scheduled date
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
    
    const incompleteTasks = tasks.filter(task => !task.completed);
    const insertOrder = incompleteTasks.length;
    
    try {
      const { data: newTask, error } = await api.createTask(accessToken, {
        text: text.trim(),
        comment: comment?.trim(),
        completed: false,
        dueDate,
        scheduledDate: finalScheduledDate,
        categoryId,
        order: insertOrder
      });

      if (error) throw new Error(error);
      if (newTask) {
        setTasks(prev => [...prev, newTask]);
        toast.success('Task created');
      }
    } catch (error) {
      console.error('Create task error:', error);
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (id: string) => {
    if (!accessToken) return;

    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const { data: updatedTask, error } = await api.updateTask(accessToken, id, {
        completed: !task.completed
      });

      if (error) throw new Error(error);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
      }
    } catch (error) {
      console.error('Toggle task error:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!accessToken) return;

    try {
      const { error } = await api.deleteTask(accessToken, id);
      if (error) throw new Error(error);
      
      setTasks(prev => prev.filter(t => t.id !== id));
      toast.success('Task deleted');
    } catch (error) {
      console.error('Delete task error:', error);
      toast.error('Failed to delete task');
    }
  };

  const editTask = async (id: string, text: string, comment?: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    if (!accessToken) return;

    try {
      const { data: updatedTask, error } = await api.updateTask(accessToken, id, {
        text: text.trim(),
        comment: comment?.trim(),
        dueDate,
        scheduledDate,
        categoryId
      });

      if (error) throw new Error(error);
      if (updatedTask) {
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));
        toast.success('Task updated');
      }
    } catch (error) {
      console.error('Update task error:', error);
      toast.error('Failed to update task');
    }
  };

  const clearCompleted = async () => {
    if (!accessToken) return;

    try {
      const { error } = await api.deleteCompletedTasks(accessToken);
      if (error) throw new Error(error);
      
      setTasks(prev => prev.filter(t => !t.completed));
      toast.success('Completed tasks cleared');
    } catch (error) {
      console.error('Clear completed error:', error);
      toast.error('Failed to clear completed tasks');
    }
  };

  const moveTask = async (dragIndex: number, hoverIndex: number) => {
    if (!accessToken) return;

    const dragTask = filteredTasks[dragIndex];
    const newTasks = [...filteredTasks];
    newTasks.splice(dragIndex, 1);
    newTasks.splice(hoverIndex, 0, dragTask);
    
    // Update order for all moved tasks
    const updates = newTasks.map((task, index) => ({
      id: task.id,
      order: index
    }));

    // Optimistically update UI
    const updatedTasks = tasks.map(task => {
      const update = updates.find(u => u.id === task.id);
      return update ? { ...task, order: update.order } : task;
    });
    setTasks(updatedTasks);

    // Update backend
    try {
      for (const update of updates) {
        await api.updateTask(accessToken, update.id, { order: update.order });
      }
    } catch (error) {
      console.error('Move task error:', error);
      toast.error('Failed to reorder tasks');
    }
  };

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
        filtered = filtered.filter(task => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= todayStart && scheduledTime < todayEnd;
        });
      } else if (dateFilter === 'tomorrow') {
        filtered = filtered.filter(task => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= tomorrowStart && scheduledTime < tomorrowEnd;
        });
      } else if (dateFilter === 'week') {
        filtered = filtered.filter(task => {
          if (!task.scheduledDate) return false;
          const scheduledStart = new Date(task.scheduledDate);
          scheduledStart.setHours(0, 0, 0, 0);
          const scheduledTime = scheduledStart.getTime();
          return scheduledTime >= todayStart && scheduledTime < weekEnd;
        });
      } else if (dateFilter === 'unscheduled') {
        filtered = filtered.filter(task => !task.scheduledDate);
      } else if (typeof dateFilter === 'number') {
        const filterStart = new Date(dateFilter);
        filterStart.setHours(0, 0, 0, 0);
        const filterEnd = filterStart.getTime() + 24 * 60 * 60 * 1000;
        filtered = filtered.filter(task => {
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
      filtered = filtered.filter(task => task.categoryId === categoryFilter);
    }

    // Apply status filter
    if (filter === 'incomplete') {
      filtered = filtered.filter(task => !task.completed);
    } else if (filter === 'completed') {
      filtered = filtered.filter(task => task.completed);
    }

    // Apply search
    if (searchQuery.trim()) {
      filtered = filtered.filter(task =>
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
    const completed = tasksToCount.filter(t => t.completed).length;
    const incomplete = total - completed;
    const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

    return { total, completed, incomplete, progress };
  }, [tasks, filteredTasks, dateFilter]);

  // Check for 100% completion
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
      addTask(quickAddInput);
      setQuickAddInput('');
    }
  };

  const handleQuickAddKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleQuickAdd();
    }
  };

  const handleModalAdd = (text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    addTask(text, comment, dueDate, scheduledDate, categoryId);
    setShowAddModal(false);
  };

  const handleEdit = (id: string, text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => {
    editTask(id, text, comment, dueDate, scheduledDate, categoryId);
    setEditingTask(null);
  };

  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const dndBackend = isTouchDevice ? TouchBackend : HTML5Backend;
  const theme = getTheme(darkMode);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-[#0f1419]' : 'bg-gray-50'}`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth pages if not authenticated
  if (!isAuthenticated) {
    if (authView === 'login') {
      return <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setAuthView('signup')} darkMode={darkMode} />;
    } else {
      return <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setAuthView('login')} darkMode={darkMode} />;
    }
  }

  // Show main app
  return (
    <DndProvider backend={dndBackend}>
      <div 
        className={`flex flex-col lg:flex-row h-screen overflow-hidden pb-16 lg:pb-0 ${darkMode ? 'dark' : 'light'}`}
        style={{ 
          backgroundColor: theme.bg.primary,
          color: theme.text.primary
        }}
      >
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
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
          {/* Mobile Header */}
          <div className="lg:hidden border-b border-gray-800 px-4 py-3 flex items-center justify-between relative">
            <div className="flex items-center gap-2">
              <h2 className="text-gray-100">TaskMate</h2>
            </div>
            <h2 className="text-gray-100 text-center absolute left-1/2 -translate-x-1/2">
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
                className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2"
              >
                {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <Sheet>
                <SheetTrigger asChild>
                  <button className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg p-2">
                    <Filter className="w-5 h-5" />
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="bg-[#1a2332] border-gray-700 w-64">
                  <SheetHeader>
                    <SheetTitle className="text-gray-100">Filters</SheetTitle>
                    <SheetDescription className="text-gray-500">
                      Filter tasks by schedule
                    </SheetDescription>
                  </SheetHeader>
                  <div className="mt-6 space-y-6">
                    <div>
                      <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-2">Schedule</h3>
                      <div className="space-y-1">
                        {['today', 'tomorrow', 'week', 'unscheduled', 'all'].map((filterType) => (
                          <button
                            key={filterType}
                            onClick={() => setDateFilter(filterType as DateFilterType)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
                              dateFilter === filterType
                                ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                                : 'text-gray-400 hover:bg-[#0f1419] hover:text-gray-300'
                            }`}
                          >
                            <span className="text-sm capitalize">{filterType === 'week' ? 'This Week' : filterType === 'all' ? 'All Days' : filterType}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-red-400 hover:bg-red-500/10"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
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

          {/* Desktop Header */}
          <div className="hidden lg:block border-b border-gray-800 px-8 py-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-gray-100">My Tasks</h1>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
            
            <div className="flex gap-3 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a2332] border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-2 text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="manual">Manual Order</option>
                <option value="a-z">Sort A→Z</option>
                <option value="z-a">Sort Z→A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>

              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2 flex items-center gap-2 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Mobile Progress and Search */}
          <div className="lg:hidden space-y-3">
            <div className="border-b border-gray-800 px-4 py-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">Progress</span>
                <span className="text-gray-300">{stats.progress}%</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all duration-300"
                  style={{ width: `${stats.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <span>{stats.completed} completed</span>
                <span>{stats.incomplete} remaining</span>
              </div>
            </div>
            
            <div className="border-b border-gray-800 px-4 pb-3 space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#1a2332] border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-blue-500"
                />
              </div>
              <select
                value={sortType}
                onChange={(e) => setSortType(e.target.value as SortType)}
                className="w-full bg-[#1a2332] border border-gray-700 rounded-lg px-4 py-2.5 text-gray-300 focus:outline-none focus:border-blue-500"
              >
                <option value="manual">Manual Order</option>
                <option value="a-z">Sort A→Z</option>
                <option value="z-a">Sort Z→A</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Quick Add - Desktop only */}
          <div className="hidden lg:block px-8 py-4 border-b border-gray-800">
            <div className="flex gap-3 items-center">
              <input
                type="text"
                placeholder="Add a task quickly... (press Enter)"
                value={quickAddInput}
                onChange={(e) => setQuickAddInput(e.target.value)}
                onKeyPress={handleQuickAddKeyPress}
                className="flex-1 bg-transparent text-gray-400 placeholder-gray-600 focus:outline-none"
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
            onMove={moveTask}
            canDragDrop={sortType === 'manual'}
            categories={categories}
          />
        </div>

        {/* Mobile Bottom Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-gray-800 flex items-center justify-around py-3 px-4 z-30">
          <button
            onClick={() => setFilter('all')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'all' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <List className="w-6 h-6" />
            <span className="text-xs">All</span>
          </button>
          <button
            onClick={() => setFilter('incomplete')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'incomplete' ? 'text-blue-500' : 'text-gray-400'
            }`}
          >
            <ListTodo className="w-6 h-6" />
            <span className="text-xs">Active</span>
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex flex-col items-center gap-1 flex-1 ${
              filter === 'completed' ? 'text-blue-500' : 'text-gray-400'
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <span className="text-xs">Clear</span>
            </button>
          )}
        </div>

        {/* Modals */}
        {showAddModal && (
          <AddTaskModal
            onAdd={handleModalAdd}
            onClose={() => setShowAddModal(false)}
            currentDateFilter={dateFilter}
            categories={categories}
          />
        )}

        {editingTask && (
          <EditTaskModal
            task={editingTask}
            onEdit={handleEdit}
            onClose={() => setEditingTask(null)}
            categories={categories}
          />
        )}

        {showCelebration && (
          <CompletionCelebration
            onDismiss={() => setShowCelebration(false)}
          />
        )}
        
        <Toaster theme={darkMode ? "dark" : "light"} position="bottom-right" richColors />
      </div>
    </DndProvider>
  );
}
