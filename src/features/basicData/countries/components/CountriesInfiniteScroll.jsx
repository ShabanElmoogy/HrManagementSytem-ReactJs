import React, { useEffect, useRef } from 'react';
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
  Divider,
} from '@mui/material';
import { Phone, AttachMoney, Flag } from '@mui/icons-material';
import { useCountriesInfinite } from '../hooks/useCountryQueries';

const CountriesInfiniteScroll = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCountriesInfinite(10); // Load 10 countries per page

  const loadMoreRef = useRef();

  // Auto-load more when scrolling to bottom
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  // Flatten all pages into a single array
  const allCountries = data?.pages?.flatMap(page => page.data) || [];
  const totalCount = data?.pages?.[0]?.totalCount || 0;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (isError) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        Error loading countries: {error?.message}
      </Alert>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Countries - Infinite Scroll
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip 
            label={`Loaded: ${allCountries.length}`} 
            color="primary" 
            variant="outlined" 
          />
          <Chip 
            label={`Total: ${totalCount}`} 
            color="secondary" 
            variant="outlined" 
          />
          {hasNextPage && (
            <Chip 
              label="More available" 
              color="success" 
              variant="outlined" 
            />
          )}
        </Stack>
      </Box>

      {/* Countries Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
        gap: 2,
        mb: 3 
      }}>
        {allCountries.map((country, index) => (
          <Card 
            key={`${country.id}-${index}`} 
            sx={{ 
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-2px)' }
            }}
          >
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {country.nameEn}
              </Typography>
              
              {country.nameAr && (
                <Typography 
                  variant="body2" 
                  color="text.secondary" 
                  sx={{ direction: 'rtl', mb: 1 }}
                >
                  {country.nameAr}
                </Typography>
              )}

              <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                {country.alpha2Code && (
                  <Chip label={country.alpha2Code} size="small" />
                )}
                {country.alpha3Code && (
                  <Chip label={country.alpha3Code} size="small" variant="outlined" />
                )}
              </Stack>

              <Stack spacing={1}>
                {country.phoneCode && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Phone sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">+{country.phoneCode}</Typography>
                  </Stack>
                )}
                
                {country.currencyCode && (
                  <Stack direction="row" spacing={1} alignItems="center">
                    <AttachMoney sx={{ fontSize: 16, color: 'text.secondary' }} />
                    <Typography variant="body2">{country.currencyCode}</Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Load More Section */}
      <Box sx={{ textAlign: 'center', py: 3 }}>
        {isFetchingNextPage && (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={24} />
            <Typography>Loading more countries...</Typography>
          </Box>
        )}

        {hasNextPage && !isFetchingNextPage && (
          <Button 
            variant="outlined" 
            onClick={() => fetchNextPage()}
            size="large"
          >
            Load More Countries
          </Button>
        )}

        {!hasNextPage && allCountries.length > 0 && (
          <Typography color="text.secondary">
            🎉 You've loaded all {totalCount} countries!
          </Typography>
        )}

        {/* Invisible element for intersection observer */}
        <div ref={loadMoreRef} style={{ height: '1px' }} />
      </Box>

      {/* Stats */}
      <Divider sx={{ my: 3 }} />
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Showing {allCountries.length} of {totalCount} countries
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Scroll down or click "Load More" to see more countries
        </Typography>
      </Box>
    </Box>
  );
};

export default CountriesInfiniteScroll;