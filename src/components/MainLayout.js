// src/components/MainLayout.js
import React, { useState, useEffect } from 'react';
import { Box, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';
import EventForm from './EventForm';
import EventList from './EventList';
import Home from './Home';
import GalleryForm from './GalleryForm';
import BannersForm from './BannersForm';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const MainLayout = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    setEvents(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <Home />;
      case 'events':
        return (
          <Box sx={{ padding: 3 }}>
            <EventForm onEventAdded={fetchEvents} />
            <EventList events={events} />
          </Box>
        );
      case 'gallery':
        return <GalleryForm />;
      case 'banners':
        return <BannersForm />;
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
        {renderContent()}
      </Box>
    </Box>
  );
};

export default MainLayout;
