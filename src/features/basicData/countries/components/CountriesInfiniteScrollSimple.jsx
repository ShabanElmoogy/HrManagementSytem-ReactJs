import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Chip,
  Stack,
  LinearProgress,
} from '@mui/material';
import { useCountriesInfinite } from '../hooks/useCountryQueries';
import { 
  useInfiniteScroll, 
  useFlattenInfiniteData, 
  useInfiniteScrollStats 
} from '../hooks/useInfiniteScroll';

const CountriesInfiniteScrollSimple = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCountriesInfinite(15); // 15 countries per page

  // Custom hooks for infinite scroll
  const allCountries = useFlattenInfiniteData(data);
  const stats = useInfiniteScrollStats(data, allCountries);
  const loadMoreRef = useInfiniteScroll(fetchNextPage, hasNextPage, isFetchingNextPage);

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading countries...</Typography>
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error: {error?.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      {/* Header with Stats */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Countries with Infinite Scroll
        </Typography>
        
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={`${stats.loadedCount} / ${stats.totalCount}`} color="primary" />
          <Chip label={`${stats.pagesLoaded} pages`} variant="outlined" />
          <Chip 
            label={`${Math.round(stats.progress)}% loaded`} 
            color="success" 
            variant="outlined" 
          />
        </Stack>

        {/* Progress Bar */}
        <LinearProgress 
          variant="determinate" 
          value={stats.progress} 
          sx={{ height: 8, borderRadius: 4 }}
        />
      </Box>

      {/* Countries List */}
      <Stack spacing={2}>
        {allCountries.map((country, index) => (
          <Card 
            key={`${country.id}-${index}`}
            sx={{ 
              transition: 'all 0.2s',
              '&:hover': { 
                transform: 'translateX(8px)',
                boxShadow: 2 
              }
            }}
          >
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="h6">
                    {country.nameEn}
                  </Typography>
                  {country.nameAr && (
                    <Typography variant="body2" color="text.secondary">
                      {country.nameAr}
                    </Typography>
                  )}
                </Box>
                
                <Stack direction="row" spacing={1}>
                  {country.alpha2Code && (
                    <Chip label={country.alpha2Code} size="small" />
                  )}
                  {country.phoneCode && (
                    <Chip label={`+${country.phoneCode}`} size="small" variant="outlined" />
                  )}
                  {country.currencyCode && (
                    <Chip label={country.currencyCode} size="small" color="secondary" />
                  )}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>

      {/* Loading More Indicator */}
      {isFetchingNextPage && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <CircularProgress size={24} />
          <Typography sx={{ ml: 2 }}>Loading more...</Typography>
        </Box>
      )}

      {/* Manual Load More Button */}
      {hasNextPage && !isFetchingNextPage && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Button 
            variant="contained" 
            onClick={() => fetchNextPage()}
            size="large"
          >
            Load More ({stats.totalCount - stats.loadedCount} remaining)
          </Button>
        </Box>
      )}

      {/* End Message */}
      {!hasNextPage && allCountries.length > 0 && (
        <Box sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h6" color="success.main">
            🎉 All {stats.totalCount} countries loaded!
          </Typography>
        </Box>
      )}

      {/* Invisible trigger for auto-scroll */}
      <div ref={loadMoreRef} style={{ height: '1px', margin: '20px 0' }} />
    </Box>
  );
};

export default CountriesInfiniteScrollSimple;