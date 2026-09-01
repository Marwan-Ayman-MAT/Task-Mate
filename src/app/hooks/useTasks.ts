import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import type { Task } from '../App';

export function useTasks(userId: string | undefined) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  // Load tasks from database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadTasks();
  }, [userId]);

  const loadTasks = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedTasks: Task[] = data.map((task) => ({
          id: task.id,
          text: task.text,
          comment: task.comment || undefined,
          completed: task.completed,
          createdAt: new Date(task.created_at).getTime(),
          dueDate: task.due_date ? new Date(task.due_date).getTime() : undefined,
          scheduledDate: task.scheduled_date ? new Date(task.scheduled_date).getTime() : undefined,
          categoryId: task.category_id || undefined,
          order: task.order,
        }));
        setTasks(formattedTasks);
      }
    } catch (error: any) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (
    text: string,
    comment?: string,
    dueDate?: number,
    scheduledDate?: number,
    categoryId?: string
  ) => {
    if (!userId || !text.trim()) return;

    try {
      // Find where to insert the new task (before completed tasks)
      const incompleteTasks = tasks.filter((task) => !task.completed);
      const insertOrder = incompleteTasks.length;

      const { data, error } = await supabase
        .from('tasks')
        .insert({
          user_id: userId,
          text: text.trim(),
          comment: comment?.trim() || null,
          completed: false,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null,
          category_id: categoryId || null,
          order: insertOrder,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newTask: Task = {
          id: data.id,
          text: data.text,
          comment: data.comment || undefined,
          completed: data.completed,
          createdAt: new Date(data.created_at).getTime(),
          dueDate: data.due_date ? new Date(data.due_date).getTime() : undefined,
          scheduledDate: data.scheduled_date ? new Date(data.scheduled_date).getTime() : undefined,
          categoryId: data.category_id || undefined,
          order: data.order,
        };
        setTasks([...tasks, newTask]);
        toast.success('Task added! 🎉');
      }
    } catch (error: any) {
      console.error('Error adding task:', error);
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (id: string) => {
    if (!userId) return;

    try {
      const task = tasks.find((t) => t.id === id);
      if (!task) return;

      const { error } = await supabase
        .from('tasks')
        .update({ completed: !task.completed })
        .eq('id', id);

      if (error) throw error;

      // Update local state and reorder
      const updatedTasks = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));

      const incompleteTasks = updatedTasks.filter((t) => !t.completed);
      const completedTasks = updatedTasks.filter((t) => t.completed);
      const reorderedTasks = [...incompleteTasks, ...completedTasks].map((task, index) => ({
        ...task,
        order: index,
      }));

      setTasks(reorderedTasks);

      // Update order in database
      for (const task of reorderedTasks) {
        await supabase.from('tasks').update({ order: task.order }).eq('id', task.id);
      }

      toast.success(task.completed ? 'Task reopened' : 'Task completed! ✅');
    } catch (error: any) {
      console.error('Error toggling task:', error);
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (id: string) => {
    if (!userId) return;

    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);

      if (error) throw error;

      setTasks(tasks.filter((task) => task.id !== id));
      toast.success('Task deleted');
    } catch (error: any) {
      console.error('Error deleting task:', error);
      toast.error('Failed to delete task');
    }
  };

  const editTask = async (
    id: string,
    text: string,
    comment?: string,
    dueDate?: number,
    scheduledDate?: number,
    categoryId?: string
  ) => {
    if (!userId) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .update({
          text: text.trim(),
          comment: comment?.trim() || null,
          due_date: dueDate ? new Date(dueDate).toISOString() : null,
          scheduled_date: scheduledDate ? new Date(scheduledDate).toISOString() : null,
          category_id: categoryId || null,
        })
        .eq('id', id);

      if (error) throw error;

      setTasks(
        tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text: text.trim(),
                comment: comment?.trim() || undefined,
                dueDate,
                scheduledDate,
                categoryId,
              }
            : task
        )
      );
      toast.success('Task updated! ✏️');
    } catch (error: any) {
      console.error('Error editing task:', error);
      toast.error('Failed to update task');
    }
  };

  const clearCompleted = async () => {
    if (!userId) return;

    try {
      const completedTaskIds = tasks.filter((t) => t.completed).map((t) => t.id);

      const { error } = await supabase.from('tasks').delete().in('id', completedTaskIds);

      if (error) throw error;

      setTasks(tasks.filter((task) => !task.completed));
      toast.success('Completed tasks cleared');
    } catch (error: any) {
      console.error('Error clearing completed tasks:', error);
      toast.error('Failed to clear tasks');
    }
  };

  const moveTask = async (dragIndex: number, hoverIndex: number, filteredTasks: Task[]) => {
    if (!userId) return;

    try {
      const dragTask = filteredTasks[dragIndex];
      const newFilteredTasks = [...filteredTasks];
      newFilteredTasks.splice(dragIndex, 1);
      newFilteredTasks.splice(hoverIndex, 0, dragTask);

      // Update order property for all tasks
      const updatedTasks = tasks.map((task) => {
        const newIndex = newFilteredTasks.findIndex((t) => t.id === task.id);
        if (newIndex !== -1) {
          return { ...task, order: newIndex };
        }
        return task;
      });

      setTasks(updatedTasks);

      // Update order in database (batch update)
      for (const task of updatedTasks) {
        await supabase.from('tasks').update({ order: task.order }).eq('id', task.id);
      }
    } catch (error: any) {
      console.error('Error moving task:', error);
      toast.error('Failed to reorder tasks');
    }
  };

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
