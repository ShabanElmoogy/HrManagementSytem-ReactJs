import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import TimeMarks from './TimeMarks';

const BookmarkTest: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [showTimeMarks, setShowTimeMarks] = useState(false);

  const simulateVideoTime = (time: number) => {
    setCurrentTime(time);
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Bookmark with Notes Test
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          Current Time: {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')}
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Button variant="outlined" onClick={() => simulateVideoTime(30)}>
            Set to 0:30
          </Button>
          <Button variant="outlined" onClick={() => simulateVideoTime(120)}>
            Set to 2:00
          </Button>
          <Button variant="outlined" onClick={() => simulateVideoTime(300)}>
            Set to 5:00
          </Button>
        </Box>
        
        <Button 
          variant="contained" 
          onClick={() => setShowTimeMarks(true)}
        >
          Open Bookmarks Panel
        </Button>
      </Box>

      <Box sx={{ bgcolor: 'grey.100', p: 2, borderRadius: 1 }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Test Instructions:</Typography>
        <Typography variant="body2" component="div">
          1. Click "Open Bookmarks Panel" to open the drawer<br/>
          2. Add bookmarks at different times<br/>
          3. Click the note icon to add notes to bookmarks<br/>
          4. Notes appear as chips below bookmarks<br/>
          5. Click on note chips to edit them
        </Typography>
      </Box>

      <TimeMarks
        currentTime={currentTime}
        onSeek={simulateVideoTime}
        isOpen={showTimeMarks}
        onClose={() => setShowTimeMarks(false)}
      />
    </Paper>
  );
};

export default BookmarkTest;