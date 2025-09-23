import React, { useState } from 'react';
import { 
  Box, 
  TextField, 
  InputAdornment, 
  List, 
  ListItem, 
  ListItemText, 
  Typography, 
  Paper,
  Chip,
  CircularProgress
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { useCountrySearch } from '../hooks/useCountryQueries';

const CountrySearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { 
    data: countries, 
    isLoading, 
    error 
  } = useCountrySearch(searchTerm, {
    enabled: searchTerm.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const hasResults = countries && countries.length > 0;

  return (
    <Box sx={{ p: 3, maxWidth: 600, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        Country Search Demo
      </Typography>
      
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        This demo shows the TanStack Query powered search with caching and stale time.
      </Typography>
      
      {/* Search Input */}
      <TextField
        fullWidth
        size="small"
        placeholder="Search countries by name, code, or phone..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Loading State */}
      {isLoading && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <CircularProgress size={16} />
          <Typography color="text.secondary">
            Searching countries...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          Error: {error.message}
        </Typography>
      )}

      {/* Search Results */}
      {searchTerm && !isLoading && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            {hasResults 
              ? `Found ${countries.length} countries` 
              : `No countries found for "${searchTerm}"`
            }
          </Typography>
        </Box>
      )}

      {/* Results List */}
      {hasResults && (
        <Paper elevation={1}>
          <List>
            {countries.slice(0, 10).map((country) => (
              <ListItem key={country.id} divider>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body1">
                        {country.nameEn}
                      </Typography>
                      {country.alpha2Code && (
                        <Chip 
                          label={country.alpha2Code} 
                          size="small" 
                          variant="outlined" 
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', gap: 2, mt: 0.5 }}>
                      {country.nameAr && (
                        <Typography variant="body2" color="text.secondary">
                          {country.nameAr}
                        </Typography>
                      )}
                      {country.phoneCode && (
                        <Typography variant="body2" color="text.secondary">
                          +{country.phoneCode}
                        </Typography>
                      )}
                      {country.currencyCode && (
                        <Typography variant="body2" color="text.secondary">
                          {country.currencyCode}
                        </Typography>
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
            {countries.length > 10 && (
              <ListItem>
                <ListItemText
                  primary={
                    <Typography variant="body2" color="text.secondary" align="center">
                      ... and {countries.length - 10} more countries
                    </Typography>
                  }
                />
              </ListItem>
            )}
          </List>
        </Paper>
      )}

      {/* No Search Term */}
      {!searchTerm && (
        <Paper elevation={1} sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary">
            Start typing to search countries...
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Features:
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Chip label="TanStack Query" size="small" color="primary" />
            <Chip label="5min Cache" size="small" color="secondary" />
            <Chip label="Real-time Search" size="small" color="success" />
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default CountrySearchDemo;