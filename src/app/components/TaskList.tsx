import type { Task, Category } from '../App';
import { TaskItem } from './TaskItem';
import { EmptyState } from './EmptyState';

interface TaskListProps {
  tasks: Task[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  canDragDrop: boolean;
  categories?: Category[];
}

export function TaskList({ tasks, onToggle, onDelete, onEdit, onMove, canDragDrop, categories = [] }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8 bg-background">
        <div className="text-center max-w-md">
          <div className="mb-6">
            <svg className="w-32 h-32 lg:w-48 lg:h-48 mx-auto text-muted" viewBox="0 0 200 200" fill="none">
              {/* Clipboard */}
              <rect x="50" y="30" width="100" height="140" rx="8" stroke="currentColor" strokeWidth="4" fill="none"/>
              <rect x="70" y="20" width="60" height="20" rx="4" fill="currentColor"/>
              {/* Checkmarks */}
              <path d="M70 70 L85 85 L110 60" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
              <path d="M70 100 L85 115 L110 90" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
              <path d="M70 130 L85 145 L110 120" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.3"/>
            </svg>
          </div>
          <h3 className="text-muted-foreground mb-2">No tasks yet</h3>
          <p className="text-muted text-sm">Add a task to get started with your productivity journey</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-4 lg:py-6 space-y-3 bg-background">
      {tasks.map((task, index) => {
        // Check if this is the transition point from incomplete to completed
        const isTransitionPoint = !task.completed && index < tasks.length - 1 && tasks[index + 1]?.completed;
        
        return (
          <div key={task.id}>
            <TaskItem
              task={task}
              index={index}
              onToggle={onToggle}
              onDelete={onDelete}
              onEdit={onEdit}
              onMove={onMove}
              canDragDrop={canDragDrop}
              categories={categories}
            />
            {isTransitionPoint && (
              <div className="flex items-center gap-3 my-4 px-2">
                <div className="flex-1 h-px bg-border"></div>
                <span className="text-xs text-muted-foreground uppercase tracking-wider">Completed</span>
                <div className="flex-1 h-px bg-border"></div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}