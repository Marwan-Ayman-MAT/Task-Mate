import { useState } from 'react';
import { X, Calendar, CalendarDays, Tag } from 'lucide-react';
import type { Category } from '../App';

type DateFilterType = 'today' | 'tomorrow' | 'week' | 'all' | 'unscheduled' | number;

interface AddTaskModalProps {
  onAdd: (text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => void;
  onClose: () => void;
  currentDateFilter?: DateFilterType;
  categories?: Category[];
}

export function AddTaskModal({ onAdd, onClose, currentDateFilter = 'today', categories = [] }: AddTaskModalProps) {
  const [text, setText] = useState('');
  const [comment, setComment] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  // Pre-fill scheduled date based on current filter
  const getDefaultScheduledDate = () => {
    if (currentDateFilter === 'all' || currentDateFilter === 'unscheduled' || currentDateFilter === 'week') {
      return '';
    }
    
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (currentDateFilter === 'today') {
      return todayStart.toISOString().split('T')[0];
    } else if (currentDateFilter === 'tomorrow') {
      const tomorrow = new Date(todayStart);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return tomorrow.toISOString().split('T')[0];
    } else if (typeof currentDateFilter === 'number') {
      return new Date(currentDateFilter).toISOString().split('T')[0];
    }
    
    return '';
  };
  
  const [scheduledDate, setScheduledDate] = useState(getDefaultScheduledDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
      const scheduledDateTimestamp = scheduledDate ? new Date(scheduledDate).getTime() : undefined;
      onAdd(text, comment, dueDateTimestamp, scheduledDateTimestamp, categoryId);
      setText('');
      setComment('');
      setDueDate('');
      setScheduledDate('');
      setCategoryId('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-card-foreground">Add New Task</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 lg:p-6 space-y-4">
          <div>
            <label className="block text-muted-foreground text-sm mb-2">
              Task
            </label>
            <input
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter task..."
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 lg:py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-muted-foreground text-sm mb-2">
              Due Date (optional)
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 lg:py-2 text-foreground focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground text-sm mb-2">
              Scheduled Date (optional)
            </label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 lg:py-2 text-foreground focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground text-sm mb-2">
              Category (optional)
            </label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full bg-secondary border border-border rounded-lg pl-10 pr-4 py-2.5 lg:py-2 text-foreground focus:outline-none focus:border-blue-500"
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-muted-foreground text-sm mb-2">
              Comment (optional)
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              rows={3}
              className="w-full bg-secondary border border-border rounded-lg px-4 py-2.5 lg:py-2 text-foreground placeholder-muted-foreground focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-secondary hover:bg-accent text-foreground rounded-lg px-4 py-2.5 lg:py-2 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-4 py-2.5 lg:py-2 transition-colors"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}