import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import EventManagement from './EventManagement';
import Home from './Home';
import GalleryForm from './GalleryForm';
import BannersForm from './BannersForm';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const MainLayout = () => {
  const [selectedTab, setSelectedTab] = useState('home');
  const [events, setEvents] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);

  const fetchEvents = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    setEvents(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }, []);

  const fetchGalleryImages = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    setGalleryImages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }, []);

  const fetchBannerImages = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'banners'));
    setBannerImages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  }, []);

  useEffect(() => {
    fetchEvents();
    fetchGalleryImages();
    fetchBannerImages();
  }, [fetchEvents, fetchGalleryImages, fetchBannerImages]);

  const renderContent = () => {
    switch (selectedTab) {
      case 'home':
        return <Home events={events} galleryImages={galleryImages} bannerImages={bannerImages} />;
      case 'events':
        return <EventManagement events={events} onEventAdded={fetchEvents} />;
      case 'gallery':
        return <GalleryForm />;
      case 'banners':
        return <BannersForm />;
      case 'settings':
        return <div className="bg-white rounded-xl shadow-md p-6">Settings Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen">
      <Sidebar onSelect={setSelectedTab} selectedTab={selectedTab} />
      <div className="flex-grow ml-16 md:ml-60 p-4 md:p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-6">
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
