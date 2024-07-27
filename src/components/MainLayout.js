// src/components/MainLayout.js
import React, { useState } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import EventForm from './EventForm';
import EventList from './EventList';

const MainLayout = () => {
  const [selectedTab, setSelectedTab] = useState('events');

  const renderContent = () => {
    switch (selectedTab) {
      case 'events':
        return (
          <Box sx={{ padding: 3 }}>
            <EventForm />
            <EventList />
          </Box>
        );
      case 'gallery':
        return <Box sx={{ padding: 3 }}>Gallery Content</Box>;
      case 'banners':
        return <Box sx={{ padding: 3 }}>Banners Content</Box>;
      case 'settings':
        return <Box sx={{ padding: 3 }}>Settings Content</Box>;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar onSelect={setSelectedTab} />
      <Box
        component="main"
        sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
      >
        <Toolbar />
        <h1>Welcome, Sir!</h1>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default MainLayout;
