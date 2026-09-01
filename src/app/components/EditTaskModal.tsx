import { useState } from 'react';
import { X, Calendar, CalendarDays, Tag } from 'lucide-react';
import type { Task, Category } from '../App';

interface EditTaskModalProps {
  task: Task;
  onEdit: (id: string, text: string, comment: string, dueDate?: number, scheduledDate?: number, categoryId?: string) => void;
  onClose: () => void;
  categories?: Category[];
}

export function EditTaskModal({ task, onEdit, onClose, categories = [] }: EditTaskModalProps) {
  const [text, setText] = useState(task.text);
  const [comment, setComment] = useState(task.comment || '');
  const [dueDate, setDueDate] = useState(
    task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
  );
  const [scheduledDate, setScheduledDate] = useState(
    task.scheduledDate ? new Date(task.scheduledDate).toISOString().split('T')[0] : ''
  );
  const [categoryId, setCategoryId] = useState(task.categoryId || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const dueDateTimestamp = dueDate ? new Date(dueDate).getTime() : undefined;
      const scheduledDateTimestamp = scheduledDate ? new Date(scheduledDate).getTime() : undefined;
      onEdit(task.id, text, comment, dueDateTimestamp, scheduledDateTimestamp, categoryId);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-4 lg:p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-card-foreground">Edit Task</h2>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}