import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';

const app = new Hono();

// Middleware
app.use('*', cors());
app.use('*', logger(console.log));

// Create Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Helper function to verify user
async function verifyUser(request: Request) {
  const accessToken = request.headers.get('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return { user: null, error: 'No authorization token provided' };
  }
  
  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user) {
    return { user: null, error: 'Unauthorized' };
  }
  
  return { user, error: null };
}

// ============================================================================
// AUTH ROUTES
// ============================================================================

// Sign up new user
app.post('/make-server-7e725d54/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name: name || email.split('@')[0] },
      // Automatically confirm email since email server isn't configured
      email_confirm: true
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user }, 201);
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Failed to create user' }, 500);
  }
});

// ============================================================================
// TASKS ROUTES
// ============================================================================

// Get all tasks for user
app.get('/make-server-7e725d54/tasks', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: tasks, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user.id)
      .order('order', { ascending: true });

    if (error) {
      console.error('Error fetching tasks:', error);
      return c.json({ error: 'Failed to fetch tasks' }, 500);
    }

    return c.json({ tasks: tasks || [] });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return c.json({ error: 'Failed to fetch tasks' }, 500);
  }
});

// Create new task
app.post('/make-server-7e725d54/tasks', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { text, comment, completed, dueDate, scheduledDate, categoryId, order } = await c.req.json();

    if (!text || text.trim() === '') {
      return c.json({ error: 'Task text is required' }, 400);
    }

    const { data: task, error } = await supabase
      .from('tasks')
      .insert({
        user_id: user.id,
        text: text.trim(),
        comment: comment?.trim() || null,
        completed: completed || false,
        due_date: dueDate || null,
        scheduled_date: scheduledDate || null,
        category_id: categoryId || null,
        order: order || 0
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating task:', error);
      return c.json({ error: 'Failed to create task' }, 500);
    }

    return c.json({ task }, 201);
  } catch (error) {
    console.error('Error creating task:', error);
    return c.json({ error: 'Failed to create task' }, 500);
  }
});

// Update task
app.put('/make-server-7e725d54/tasks/:id', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');
    const updates = await c.req.json();

    // Verify task belongs to user
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single();

    if (!existingTask || existingTask.user_id !== user.id) {
      return c.json({ error: 'Task not found or unauthorized' }, 404);
    }

    const updateData: any = {};
    if (updates.text !== undefined) updateData.text = updates.text.trim();
    if (updates.comment !== undefined) updateData.comment = updates.comment?.trim() || null;
    if (updates.completed !== undefined) updateData.completed = updates.completed;
    if (updates.dueDate !== undefined) updateData.due_date = updates.dueDate || null;
    if (updates.scheduledDate !== undefined) updateData.scheduled_date = updates.scheduledDate || null;
    if (updates.categoryId !== undefined) updateData.category_id = updates.categoryId || null;
    if (updates.order !== undefined) updateData.order = updates.order;

    const { data: task, error } = await supabase
      .from('tasks')
      .update(updateData)
      .eq('id', taskId)
      .select()
      .single();

    if (error) {
      console.error('Error updating task:', error);
      return c.json({ error: 'Failed to update task' }, 500);
    }

    return c.json({ task });
  } catch (error) {
    console.error('Error updating task:', error);
    return c.json({ error: 'Failed to update task' }, 500);
  }
});

// Delete task
app.delete('/make-server-7e725d54/tasks/:id', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const taskId = c.req.param('id');

    // Verify task belongs to user
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('user_id')
      .eq('id', taskId)
      .single();

    if (!existingTask || existingTask.user_id !== user.id) {
      return c.json({ error: 'Task not found or unauthorized' }, 404);
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', taskId);

    if (error) {
      console.error('Error deleting task:', error);
      return c.json({ error: 'Failed to delete task' }, 500);
    }

    return c.json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return c.json({ error: 'Failed to delete task' }, 500);
  }
});

// Delete all completed tasks
app.delete('/make-server-7e725d54/tasks/completed/all', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('user_id', user.id)
      .eq('completed', true);

    if (error) {
      console.error('Error deleting completed tasks:', error);
      return c.json({ error: 'Failed to delete completed tasks' }, 500);
    }

    return c.json({ message: 'Completed tasks deleted successfully' });
  } catch (error) {
    console.error('Error deleting completed tasks:', error);
    return c.json({ error: 'Failed to delete completed tasks' }, 500);
  }
});

// ============================================================================
// CATEGORIES ROUTES
// ============================================================================

// Get all categories for user
app.get('/make-server-7e725d54/categories', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: categories, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', user.id);

    if (error) {
      console.error('Error fetching categories:', error);
      return c.json({ error: 'Failed to fetch categories' }, 500);
    }

    return c.json({ categories: categories || [] });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({ error: 'Failed to fetch categories' }, 500);
  }
});

// Create new category
app.post('/make-server-7e725d54/categories', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { name, color } = await c.req.json();

    if (!name || name.trim() === '') {
      return c.json({ error: 'Category name is required' }, 400);
    }

    const { data: category, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: name.trim(),
        color: color || '#3b82f6'
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return c.json({ error: 'Failed to create category' }, 500);
    }

    return c.json({ category }, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    return c.json({ error: 'Failed to create category' }, 500);
  }
});

// ============================================================================
// PREFERENCES ROUTES
// ============================================================================

// Get user preferences
app.get('/make-server-7e725d54/preferences', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { data: prefs, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching preferences:', error);
      return c.json({ error: 'Failed to fetch preferences' }, 500);
    }

    return c.json({ preferences: prefs || null });
  } catch (error) {
    console.error('Error fetching preferences:', error);
    return c.json({ error: 'Failed to fetch preferences' }, 500);
  }
});

// Update user preferences
app.put('/make-server-7e725d54/preferences', async (c) => {
  try {
    const { user, error: authError } = await verifyUser(c.req.raw);
    if (authError || !user) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const updates = await c.req.json();

    // Check if preferences exist
    const { data: existing } = await supabase
      .from('user_preferences')
      .select('user_id')
      .eq('user_id', user.id)
      .single();

    let data, error;

    if (existing) {
      // Update existing preferences
      const result = await supabase
        .from('user_preferences')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();
      data = result.data;
      error = result.error;
    } else {
      // Create new preferences
      const result = await supabase
        .from('user_preferences')
        .insert({ user_id: user.id, ...updates })
        .select()
        .single();
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Error updating preferences:', error);
      return c.json({ error: 'Failed to update preferences' }, 500);
    }

    return c.json({ preferences: data });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return c.json({ error: 'Failed to update preferences' }, 500);
  }
});

// Health check
app.get('/make-server-7e725d54/health', (c) => {
  return c.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

Deno.serve(app.fetch);
