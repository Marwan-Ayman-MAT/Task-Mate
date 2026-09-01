import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase/client';
import { toast } from 'sonner@2.0.3';
import type { Category } from '../App';

export function useCategories(userId: string | undefined) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Load categories from database
  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    loadCategories();
  }, [userId]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data) {
        const formattedCategories: Category[] = data.map((cat) => ({
          id: cat.id,
          name: cat.name,
          color: cat.color,
        }));
        setCategories(formattedCategories);
      }
    } catch (error: any) {
      console.error('Error loading categories:', error);
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (name: string, color: string) => {
    if (!userId || !name.trim()) return;

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          user_id: userId,
          name: name.trim(),
          color,
        })
        .select()
        .single();

      if (error) throw error;

      if (data) {
        const newCategory: Category = {
          id: data.id,
          name: data.name,
          color: data.color,
        };
        setCategories([...categories, newCategory]);
        toast.success('Category added! 🏷️');
      }
    } catch (error: any) {
      console.error('Error adding category:', error);
      toast.error('Failed to add category');
    }
  };

  return {
    categories,
    loading,
    addCategory,
  };
}
