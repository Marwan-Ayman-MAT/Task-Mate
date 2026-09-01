import { projectId, publicAnonKey } from './supabase/info';
import type { Task, Category } from '../App';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-7e725d54`;

// ============================================================================
// AUTH API
// ============================================================================

export async function signUp(email: string, password: string, name?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify({ email, password, name })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to sign up');
    }

    return { data: data.user, error: null };
  } catch (error) {
    console.error('Sign up error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to sign up' };
  }
}

// ============================================================================
// TASKS API
// ============================================================================

export async function fetchTasks(accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch tasks');
    }

    // Convert database format to app format
    const tasks: Task[] = (data.tasks || []).map((task: any) => ({
      id: task.id,
      text: task.text,
      comment: task.comment,
      completed: task.completed,
      createdAt: new Date(task.created_at).getTime(),
      dueDate: task.due_date,
      scheduledDate: task.scheduled_date,
      categoryId: task.category_id,
      order: task.order
    }));

    return { data: tasks, error: null };
  } catch (error) {
    console.error('Fetch tasks error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch tasks' };
  }
}

export async function createTask(accessToken: string, task: Partial<Task>) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        text: task.text,
        comment: task.comment,
        completed: task.completed || false,
        dueDate: task.dueDate,
        scheduledDate: task.scheduledDate,
        categoryId: task.categoryId,
        order: task.order || 0
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create task');
    }

    // Convert database format to app format
    const createdTask: Task = {
      id: data.task.id,
      text: data.task.text,
      comment: data.task.comment,
      completed: data.task.completed,
      createdAt: new Date(data.task.created_at).getTime(),
      dueDate: data.task.due_date,
      scheduledDate: data.task.scheduled_date,
      categoryId: data.task.category_id,
      order: data.task.order
    };

    return { data: createdTask, error: null };
  } catch (error) {
    console.error('Create task error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create task' };
  }
}

export async function updateTask(accessToken: string, taskId: string, updates: Partial<Task>) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        text: updates.text,
        comment: updates.comment,
        completed: updates.completed,
        dueDate: updates.dueDate,
        scheduledDate: updates.scheduledDate,
        categoryId: updates.categoryId,
        order: updates.order
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update task');
    }

    // Convert database format to app format
    const updatedTask: Task = {
      id: data.task.id,
      text: data.task.text,
      comment: data.task.comment,
      completed: data.task.completed,
      createdAt: new Date(data.task.created_at).getTime(),
      dueDate: data.task.due_date,
      scheduledDate: data.task.scheduled_date,
      categoryId: data.task.category_id,
      order: data.task.order
    };

    return { data: updatedTask, error: null };
  } catch (error) {
    console.error('Update task error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update task' };
  }
}

export async function deleteTask(accessToken: string, taskId: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete task');
    }

    return { error: null };
  } catch (error) {
    console.error('Delete task error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete task' };
  }
}

export async function deleteCompletedTasks(accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/completed/all`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete completed tasks');
    }

    return { error: null };
  } catch (error) {
    console.error('Delete completed tasks error:', error);
    return { error: error instanceof Error ? error.message : 'Failed to delete completed tasks' };
  }
}

// ============================================================================
// CATEGORIES API
// ============================================================================

export async function fetchCategories(accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch categories');
    }

    const categories: Category[] = (data.categories || []).map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      color: cat.color
    }));

    return { data: categories, error: null };
  } catch (error) {
    console.error('Fetch categories error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch categories' };
  }
}

export async function createCategory(accessToken: string, name: string, color: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ name, color })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create category');
    }

    const category: Category = {
      id: data.category.id,
      name: data.category.name,
      color: data.category.color
    };

    return { data: category, error: null };
  } catch (error) {
    console.error('Create category error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to create category' };
  }
}

// ============================================================================
// PREFERENCES API
// ============================================================================

export async function fetchPreferences(accessToken: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch preferences');
    }

    return { data: data.preferences, error: null };
  } catch (error) {
    console.error('Fetch preferences error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to fetch preferences' };
  }
}

export async function updatePreferences(accessToken: string, preferences: any) {
  try {
    const response = await fetch(`${API_BASE_URL}/preferences`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(preferences)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to update preferences');
    }

    return { data: data.preferences, error: null };
  } catch (error) {
    console.error('Update preferences error:', error);
    return { data: null, error: error instanceof Error ? error.message : 'Failed to update preferences' };
  }
}
