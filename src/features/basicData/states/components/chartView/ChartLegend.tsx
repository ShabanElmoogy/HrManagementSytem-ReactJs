import React from 'react';
import { Box, Chip, alpha } from '@mui/material';

interface LegendItem {
  name: string;
  value: number;
}

interface ChartLegendProps {
  data: LegendItem[];
  colors: string[];
  showValues?: boolean;
}

const ChartLegend: React.FC<ChartLegendProps> = ({ 
  data, 
  colors, 
  showValues = true 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mt: 3, display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 1 }}>
      {data.map((item, index) => (
        <Chip
          key={item.name}
          label={showValues ? `${item.name} (${item.value})` : item.name}
          size="small"
          sx={{
            backgroundColor: alpha(colors[index % colors.length], 0.1),
            color: colors[index % colors.length],
            border: `1px solid ${alpha(colors[index % colors.length], 0.3)}`,
          }}
        />
      ))}
    </Box>
  );
};

export default ChartLegend;