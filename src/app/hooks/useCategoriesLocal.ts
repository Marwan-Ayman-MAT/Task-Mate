import { useLocalStorage } from './useLocalStorage';

export interface Category {
  id: string;
  name: string;
  color: string;
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: 'urgent', name: 'Urgent', color: '#ef4444' },
  { id: 'work', name: 'Work', color: '#f97316' },
  { id: 'personal', name: 'Personal', color: '#eab308' },
  { id: 'health', name: 'Health', color: '#22c55e' },
  { id: 'learning', name: 'Learning', color: '#3b82f6' },
  { id: 'projects', name: 'Projects', color: '#a855f7' },
];

export function useCategoriesLocal() {
  const [categories] = useLocalStorage<Category[]>('taskmate_categories', DEFAULT_CATEGORIES);
  
  return {
    categories,
    loading: false,
  };
}
