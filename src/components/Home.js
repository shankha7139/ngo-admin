// src/components/Home.js
import React from 'react';
import { Typography, Box } from '@mui/material';

const Home = () => {
  return (
    <Box className="p-4">
      <Typography variant="h4" gutterBottom>
        Welcome, Sir!
      </Typography>
      <Typography variant="body1">
        This is your admin panel. Use the tabs on the left to manage events, gallery, banners, and settings.
      </Typography>
    </Box>
  );
};

export default Home;
