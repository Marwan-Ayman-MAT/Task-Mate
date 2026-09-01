import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { useLocalStorage } from './useLocalStorage';

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

const DEFAULT_TASKS: Task[] = [];

export function useTasksLocal() {
  const [tasks, setTasks] = useLocalStorage<Task[]>(
    'taskmate_tasks',
    DEFAULT_TASKS
  );

  const [loading, setLoading] = useState(false);

  const addTask = useCallback((
    text: string,
    comment?: string,
    dueDate?: number,
    scheduledDate?: number,
    categoryId?: string
  ) => {
    const newTask: Task = {
      id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      text,
      comment,
      completed: false,
      createdAt: Date.now(),
      dueDate,
      scheduledDate,
      categoryId,
      order: tasks.length,
    };

    setTasks([...tasks, newTask]);
    toast.success('Task added successfully! ✅');
  }, [tasks, setTasks]);

  const toggleTask = useCallback((id: string) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newCompleted = !task.completed;

        if (newCompleted) {
          toast.success('Task completed! 🎉');
        } else {
          toast.info('Task reopened');
        }

        return {
          ...task,
          completed: newCompleted
        };
      }

      return task;
    }));
  }, [tasks, setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Task deleted');
  }, [tasks, setTasks]);

  const editTask = useCallback((
    id: string,
    text: string,
    comment: string,
    dueDate?: number,
    scheduledDate?: number,
    categoryId?: string
  ) => {
    setTasks(tasks.map(task =>
      task.id === id
        ? {
            ...task,
            text,
            comment,
            dueDate,
            scheduledDate,
            categoryId
          }
        : task
    ));

    toast.success('Task updated successfully! ✅');
  }, [tasks, setTasks]);

  const clearCompleted = useCallback(() => {
    const completedCount = tasks.filter(t => t.completed).length;

    setTasks(tasks.filter(task => !task.completed));

    toast.success(
      `${completedCount} completed task${completedCount !== 1 ? 's' : ''} cleared! 🗑️`
    );
  }, [tasks, setTasks]);

  const moveTask = useCallback((
    dragIndex: number,
    hoverIndex: number,
    filteredTasks: Task[]
  ) => {
    const draggedTask = filteredTasks[dragIndex];
    const targetTask = filteredTasks[hoverIndex];

    if (!draggedTask || !targetTask) return;

    setTasks(prevTasks => {
      const newTasks = [...prevTasks];

      const dragTaskIndex = newTasks.findIndex(
        t => t.id === draggedTask.id
      );

      const hoverTaskIndex = newTasks.findIndex(
        t => t.id === targetTask.id
      );

      if (dragTaskIndex === -1 || hoverTaskIndex === -1) {
        return prevTasks;
      }

      // Remove dragged task
      const [removed] = newTasks.splice(dragTaskIndex, 1);

      // Insert at new position
      newTasks.splice(hoverTaskIndex, 0, removed);

      // Update order values
      return newTasks.map((task, index) => ({
        ...task,
        order: index
      }));
    });
  }, [setTasks]);

  return {
    tasks,
    loading,
    addTask,
    toggleTask,
    deleteTask,
    editTask,
    clearCompleted,
    moveTask,
  };
}