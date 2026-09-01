-- ============================================
-- TaskMate Database Schema
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- Dashboard -> SQL Editor -> New Query -> Paste and Run
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#3b82f6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);

-- Row Level Security (RLS) for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own categories
CREATE POLICY "Users can view own categories" 
  ON categories FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own categories
CREATE POLICY "Users can insert own categories" 
  ON categories FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own categories
CREATE POLICY "Users can update own categories" 
  ON categories FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own categories
CREATE POLICY "Users can delete own categories" 
  ON categories FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- TASKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  comment TEXT,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  due_date TIMESTAMP WITH TIME ZONE,
  scheduled_date TIMESTAMP WITH TIME ZONE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_completed ON tasks(completed);
CREATE INDEX IF NOT EXISTS idx_tasks_scheduled_date ON tasks(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_tasks_category_id ON tasks(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_order ON tasks("order");

-- Row Level Security (RLS) for tasks
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own tasks
CREATE POLICY "Users can view own tasks" 
  ON tasks FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own tasks
CREATE POLICY "Users can insert own tasks" 
  ON tasks FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own tasks
CREATE POLICY "Users can update own tasks" 
  ON tasks FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own tasks
CREATE POLICY "Users can delete own tasks" 
  ON tasks FOR DELETE 
  USING (auth.uid() = user_id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for categories
DROP TRIGGER IF EXISTS update_categories_updated_at ON categories;
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for tasks
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
CREATE TRIGGER update_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SEED DEFAULT CATEGORIES (Optional)
-- ============================================
-- Uncomment and modify the user_id to add default categories for a specific user
-- Replace 'YOUR_USER_ID_HERE' with actual user UUID after signup

/*
INSERT INTO categories (user_id, name, color) VALUES
  ('YOUR_USER_ID_HERE', 'Work', '#3b82f6'),
  ('YOUR_USER_ID_HERE', 'Personal', '#10b981'),
  ('YOUR_USER_ID_HERE', 'Urgent', '#ef4444'),
  ('YOUR_USER_ID_HERE', 'Shopping', '#f59e0b'),
  ('YOUR_USER_ID_HERE', 'Health', '#8b5cf6'),
  ('YOUR_USER_ID_HERE', 'Learning', '#ec4899');
*/
