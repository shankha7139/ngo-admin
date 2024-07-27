// src/components/MainLayout.js
import React, { useState, useEffect } from 'react';
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
          <div className="p-4">
            <EventForm onEventAdded={fetchEvents} />
            <EventList events={events} />
          </div>
        );
      case 'gallery':
        return <GalleryForm />;
      case 'banners':
        return <BannersForm />;
      case 'settings':
        return <div className="p-4">Settings Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelect={setSelectedTab} />
      <div className="flex-grow ml-16 md:ml-60 bg-gray-100 min-h-screen p-4 transition-all">
        {renderContent()}
      </div>
    </div>
  );
};

export default MainLayout;
