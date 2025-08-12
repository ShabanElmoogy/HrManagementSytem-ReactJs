// Global Search Components
export { default as GlobalSearchBar } from './GlobalSearchBar';
export { default as GlobalSearchModal } from './GlobalSearchModal';

// Re-export hooks for convenience
export { 
  useGlobalSearch, 
  useSimpleGlobalSearch, 
  useEntitySearch 
} from '@/shared/hooks/useGlobalSearch';