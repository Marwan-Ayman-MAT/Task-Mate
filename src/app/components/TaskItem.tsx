import { useRef, useState, useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Edit2, Calendar, GripVertical, Clock, Sparkles, CalendarDays, Tag } from 'lucide-react';
import type { Task, Category } from '../App';

interface TaskItemProps {
  task: Task;
  index: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onMove: (dragIndex: number, hoverIndex: number) => void;
  canDragDrop: boolean;
  categories?: Category[];
}

const ITEM_TYPE = 'TASK';

export function TaskItem({ task, index, onToggle, onDelete, onEdit, onMove, canDragDrop, categories = [] }: TaskItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [wasCompleted, setWasCompleted] = useState(task.completed);

  useEffect(() => {
    // Trigger celebration when task becomes completed
    if (!wasCompleted && task.completed) {
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 1000);
    }
    setWasCompleted(task.completed);
  }, [task.completed, wasCompleted]);

  const [{ isDragging }, drag, preview] = useDrag({
    type: ITEM_TYPE,
    item: { index },
    canDrag: canDragDrop,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: ITEM_TYPE,
    canDrop: () => canDragDrop,
    hover: (item: { index: number }) => {
      if (!ref.current || !canDragDrop) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      onMove(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Combine drag and drop refs
  preview(drop(ref));

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if task is overdue
  const isOverdue = task.dueDate && task.dueDate < Date.now() && !task.completed;
  const isDueSoon = task.dueDate && task.dueDate > Date.now() && task.dueDate < Date.now() + 24 * 60 * 60 * 1000 && !task.completed;

  return (
    <div
      ref={ref}
      className={`bg-card border border-border rounded-lg p-3 lg:p-4 group hover:border-muted transition-all relative overflow-hidden ${
        isDragging ? 'opacity-50' : 'opacity-100'
      } ${isOverdue ? 'border-l-4 border-l-red-500' : ''} ${isDueSoon ? 'border-l-4 border-l-yellow-500' : ''}`}
      title={`Created: ${formatDateTime(task.createdAt)}`}
    >
      {/* Celebration Animation */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 pointer-events-none z-10"
          >
            {/* Confetti particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  x: '50%',
                  y: '50%',
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  x: `${50 + (Math.random() - 0.5) * 200}%`,
                  y: `${50 + (Math.random() - 0.5) * 200}%`,
                  scale: [0, 1.5, 0],
                  opacity: [1, 1, 0],
                  rotate: Math.random() * 360
                }}
                transition={{
                  duration: 0.8,
                  ease: 'easeOut'
                }}
                className="absolute w-2 h-2 rounded-full"
                style={{
                  backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899'][i % 4]
                }}
              />
            ))}
            
            {/* Success pulse */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.3, 0] }}
              transition={{ duration: 0.6 }}
              className="absolute inset-0 bg-green-500 rounded-lg"
            />
            
            {/* Sparkle icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: [0, 1.2, 0], rotate: 0 }}
              transition={{ duration: 0.6 }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <Sparkles className="w-12 h-12 text-yellow-400" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex items-start gap-2 lg:gap-3">
        {/* Drag Handle - visible on mobile and desktop when drag is enabled */}
        {canDragDrop && (
          <div ref={drag} className="cursor-move text-muted-foreground hover:text-foreground active:text-foreground transition-colors pt-0.5 touch-none">
            <GripVertical className="w-5 h-5 lg:w-4 lg:h-4" />
          </div>
        )}

        <button
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 lg:w-5 lg:h-5 mt-0.5 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-muted hover:border-muted-foreground'
          }`}
        >
          {task.completed && (
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start flex-wrap gap-2">
            <span
              className={`block break-words ${
                task.completed ? 'line-through text-muted-foreground' : 'text-card-foreground'
              }`}
            >
              {task.text}
            </span>
            
            {/* Scheduled Date Indicator */}
            {task.scheduledDate && (
              <div className="flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 whitespace-nowrap">
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.scheduledDate)}</span>
              </div>
            )}
            
            {/* Due Date Indicator */}
            {task.dueDate && (
              <div className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded whitespace-nowrap ${
                isOverdue 
                  ? 'bg-red-500/20 text-red-400' 
                  : isDueSoon 
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-blue-500/20 text-blue-400'
              }`}>
                <CalendarDays className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
              </div>
            )}
            
            {/* Category Indicator */}
            {task.categoryId && (
              <div
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded whitespace-nowrap"
                style={{
                  backgroundColor: `${categories.find(cat => cat.id === task.categoryId)?.color}20`,
                  color: categories.find(cat => cat.id === task.categoryId)?.color
                }}
              >
                <Tag className="w-3 h-3" />
                <span>{categories.find(cat => cat.id === task.categoryId)?.name || 'Unknown'}</span>
              </div>
            )}
          </div>
          
          {task.comment && (
            <p className="text-muted-foreground text-sm mt-1 break-words">{task.comment}</p>
          )}
          
          {/* Creation date shown on hover - hidden on mobile */}
          <div className="hidden lg:flex items-center gap-1 text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Clock className="w-3 h-3" />
            <span>Created {formatDate(task.createdAt)}</span>
          </div>
        </div>

        {/* Action buttons - always visible on mobile, hover on desktop */}
        <div className="flex gap-1 lg:gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(task)}
            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-muted-foreground hover:text-blue-400 transition-all p-1.5 lg:p-0"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className="opacity-100 lg:opacity-0 lg:group-hover:opacity-100 text-muted-foreground hover:text-red-400 transition-all p-1.5 lg:p-0"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}