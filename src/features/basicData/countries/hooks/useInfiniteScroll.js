import { useEffect, useRef } from 'react';

/**
 * Custom hook for infinite scroll functionality
 * @param {Function} fetchNextPage - Function to fetch next page
 * @param {boolean} hasNextPage - Whether there are more pages
 * @param {boolean} isFetchingNextPage - Whether currently fetching
 * @param {Object} options - Configuration options
 */
export const useInfiniteScroll = (
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  options = {}
) => {
  const {
    threshold = 1.0,
    rootMargin = '0px',
    enabled = true,
  } = options;

  const loadMoreRef = useRef();

  useEffect(() => {
    if (!enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, threshold, rootMargin, enabled]);

  return loadMoreRef;
};

/**
 * Hook to flatten infinite query pages into a single array
 * @param {Object} data - Infinite query data
 * @returns {Array} Flattened array of items
 */
export const useFlattenInfiniteData = (data) => {
  return data?.pages?.flatMap(page => page.data) || [];
};

/**
 * Hook to get infinite scroll stats
 * @param {Object} data - Infinite query data
 * @param {Array} flattenedData - Flattened data array
 * @returns {Object} Stats object
 */
export const useInfiniteScrollStats = (data, flattenedData) => {
  const totalCount = data?.pages?.[0]?.totalCount || 0;
  const loadedCount = flattenedData.length;
  const pagesLoaded = data?.pages?.length || 0;
  
  return {
    totalCount,
    loadedCount,
    pagesLoaded,
    hasMore: loadedCount < totalCount,
    progress: totalCount > 0 ? (loadedCount / totalCount) * 100 : 0,
  };
};