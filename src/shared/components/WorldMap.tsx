/* eslint-disable react/prop-types */
import React, { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  useTheme,
  alpha,
  Tooltip,
  Chip,
  Avatar,
  IconButton
} from '@mui/material';
import {
  Public,
  LocationOn,
  People,
  Business,
  ZoomIn,
  ZoomOut,
  CenterFocusStrong
} from '@mui/icons-material';

// World map data - simplified SVG paths for major countries
const worldMapData = [
  // North America
  { id: 'US', name: 'United States', path: 'M100,200 L150,180 L180,200 L170,250 L120,270 L100,250 Z', continent: 'North America' },
  { id: 'CA', name: 'Canada', path: 'M100,150 L180,130 L200,180 L150,200 L100,180 Z', continent: 'North America' },
  { id: 'MX', name: 'Mexico', path: 'M120,280 L180,260 L190,320 L130,340 L120,320 Z', continent: 'North America' },

  // South America
  { id: 'BR', name: 'Brazil', path: 'M220,350 L280,330 L290,420 L230,440 L220,400 Z', continent: 'South America' },
  { id: 'AR', name: 'Argentina', path: 'M200,450 L260,430 L270,480 L210,500 L200,480 Z', continent: 'South America' },

  // Europe
  { id: 'GB', name: 'United Kingdom', path: 'M380,180 L420,170 L430,200 L390,210 L380,190 Z', continent: 'Europe' },
  { id: 'DE', name: 'Germany', path: 'M420,190 L470,180 L480,210 L430,220 L420,200 Z', continent: 'Europe' },
  { id: 'FR', name: 'France', path: 'M400,210 L440,200 L450,230 L410,240 L400,220 Z', continent: 'Europe' },
  { id: 'IT', name: 'Italy', path: 'M430,230 L470,220 L480,250 L440,260 L430,240 Z', continent: 'Europe' },
  { id: 'ES', name: 'Spain', path: 'M380,240 L420,230 L430,260 L390,270 L380,250 Z', continent: 'Europe' },

  // Asia
  { id: 'CN', name: 'China', path: 'M550,200 L650,180 L670,280 L570,300 L550,250 Z', continent: 'Asia' },
  { id: 'JP', name: 'Japan', path: 'M680,220 L720,210 L730,240 L690,250 L680,230 Z', continent: 'Asia' },
  { id: 'IN', name: 'India', path: 'M520,280 L580,270 L590,330 L530,340 L520,310 Z', continent: 'Asia' },
  { id: 'KR', name: 'South Korea', path: 'M650,230 L680,220 L690,250 L660,260 L650,240 Z', continent: 'Asia' },

  // Africa
  { id: 'ZA', name: 'South Africa', path: 'M450,420 L510,410 L520,460 L460,470 L450,440 Z', continent: 'Africa' },
  { id: 'EG', name: 'Egypt', path: 'M470,300 L520,290 L530,320 L480,330 L470,310 Z', continent: 'Africa' },
  { id: 'NG', name: 'Nigeria', path: 'M420,340 L470,330 L480,370 L430,380 L420,350 Z', continent: 'Africa' },

  // Oceania
  { id: 'AU', name: 'Australia', path: 'M600,380 L700,370 L710,430 L610,440 L600,400 Z', continent: 'Oceania' }
];

interface CountryData {
  id: string;
  name: string;
  employees: number;
  offices: number;
  revenue: number;
  currency: string;
  timezone: string;
  flag: string;
}

interface WorldMapProps {
  data: CountryData[];
  onCountryClick?: (country: CountryData) => void;
  height?: number;
  showStats?: boolean;
}

const WorldMap: React.FC<WorldMapProps> = ({
  data,
  onCountryClick,
  height = 500,
  showStats = true
}) => {
  const theme = useTheme();
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // Create a map of country data for quick lookup
  const countryDataMap = useMemo(() => {
    return data.reduce((acc, country) => {
      acc[country.id] = country;
      return acc;
    }, {} as Record<string, CountryData>);
  }, [data]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalEmployees = data.reduce((sum, country) => sum + country.employees, 0);
    const totalOffices = data.reduce((sum, country) => sum + country.offices, 0);
    const totalRevenue = data.reduce((sum, country) => sum + country.revenue, 0);
    const countriesWithPresence = data.length;

    return { totalEmployees, totalOffices, totalRevenue, countriesWithPresence };
  }, [data]);

  const getCountryColor = (countryId: string) => {
    const countryData = countryDataMap[countryId];
    if (!countryData) return theme.palette.grey[300];

    const intensity = Math.min(countryData.employees / 100, 1); // Max at 100 employees
    return alpha(theme.palette.primary.main, 0.3 + intensity * 0.7);
  };

  const handleCountryClick = (countryId: string) => {
    const countryData = countryDataMap[countryId];
    if (countryData && onCountryClick) {
      onCountryClick(countryData);
    }
  };

  const handleZoomIn = () => setZoom(prev => Math.min(prev * 1.2, 3));
  const handleZoomOut = () => setZoom(prev => Math.max(prev / 1.2, 0.5));
  const handleReset = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <Paper sx={{ p: 3, height: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, display: 'flex', alignItems: 'center' }}>
          <Public sx={{ mr: 1 }} />
          Global Presence
        </Typography>

        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton onClick={handleZoomIn} size="small">
            <ZoomIn />
          </IconButton>
          <IconButton onClick={handleZoomOut} size="small">
            <ZoomOut />
          </IconButton>
          <IconButton onClick={handleReset} size="small">
            <CenterFocusStrong />
          </IconButton>
        </Box>
      </Box>

      {/* Statistics Cards */}
      {showStats && (
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
            minWidth: 150
          }}>
            <People sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.totalEmployees.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Total Employees
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.success.main, 0.1),
            border: `1px solid ${alpha(theme.palette.success.main, 0.2)}`,
            minWidth: 150
          }}>
            <Business sx={{ mr: 1, color: theme.palette.success.main }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.totalOffices}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Office Locations
              </Typography>
            </Box>
          </Box>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            p: 2,
            borderRadius: 2,
            backgroundColor: alpha(theme.palette.info.main, 0.1),
            border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            minWidth: 150
          }}>
            <Public sx={{ mr: 1, color: theme.palette.info.main }} />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {stats.countriesWithPresence}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Countries
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      {/* World Map */}
      <Box sx={{
        position: 'relative',
        height,
        backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[900] : theme.palette.grey[50],
        borderRadius: 2,
        overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`
      }}>
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 800 500"
          style={{
            transform: `scale(${zoom}) translate(${pan.x}px, ${pan.y}px)`,
            transformOrigin: 'center',
            transition: 'transform 0.3s ease'
          }}
        >
          {/* Ocean background */}
          <rect width="800" height="500" fill={theme.palette.mode === 'dark' ? theme.palette.grey[800] : theme.palette.grey[100]} />

          {/* Country paths */}
          {worldMapData.map((country) => {
            const countryData = countryDataMap[country.id];
            const isHovered = hoveredCountry === country.id;
            const hasData = !!countryData;

            return (
              <Tooltip
                key={country.id}
                title={
                  countryData ? (
                    <Box sx={{ p: 1 }}>
                      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                        {countryData.flag} {country.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                        <Chip
                          icon={<People />}
                          label={`${countryData.employees} employees`}
                          size="small"
                          variant="outlined"
                        />
                        <Chip
                          icon={<Business />}
                          label={`${countryData.offices} offices`}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                      <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                        Revenue: {countryData.currency} {countryData.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  ) : (
                    <Typography>{country.name}</Typography>
                  )
                }
                arrow
                placement="top"
              >
                <path
                  d={country.path}
                  fill={hasData ? getCountryColor(country.id) : (theme.palette.mode === 'dark' ? theme.palette.grey[700] : theme.palette.grey[300])}
                  stroke={theme.palette.divider}
                  strokeWidth={isHovered ? 2 : 1}
                  style={{
                    cursor: hasData ? 'pointer' : 'default',
                    transition: 'all 0.2s ease',
                    filter: isHovered ? 'brightness(1.1)' : 'none'
                  }}
                  onMouseEnter={() => setHoveredCountry(country.id)}
                  onMouseLeave={() => setHoveredCountry(null)}
                  onClick={() => handleCountryClick(country.id)}
                />
              </Tooltip>
            );
          })}

          {/* Office markers */}
          {data.map((country) => {
            if (country.offices > 0) {
              // Find the country's position (simplified - in real app would use actual coordinates)
              const countryShape = worldMapData.find(c => c.id === country.id);
              if (countryShape) {
                // Extract approximate center from path (simplified)
                const bounds = countryShape.path.match(/(\d+),(\d+)/g);
                if (bounds && bounds.length > 0) {
                  const coords = bounds[0].split(',').map(Number);
                  return (
                    <circle
                      key={`office-${country.id}`}
                      cx={coords[0]}
                      cy={coords[1]}
                      r={Math.min(country.offices * 2 + 4, 12)}
                      fill={theme.palette.success.main}
                      stroke={theme.palette.common.white}
                      strokeWidth={2}
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCountryClick(country.id)}
                    />
                  );
                }
              }
            }
            return null;
          })}
        </svg>

        {/* Legend */}
        <Box sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          backgroundColor: alpha(theme.palette.background.paper, 0.9),
          borderRadius: 1,
          p: 2,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha(theme.palette.divider, 0.5)}`
        }}>
          <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
            Legend
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: theme.palette.success.main,
                border: `2px solid ${theme.palette.common.white}`
              }} />
              <Typography variant="caption">Office Location</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{
                width: 12,
                height: 12,
                backgroundColor: alpha(theme.palette.primary.main, 0.5),
                border: `1px solid ${theme.palette.divider}`
              }} />
              <Typography variant="caption">Employee Presence</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default WorldMap;