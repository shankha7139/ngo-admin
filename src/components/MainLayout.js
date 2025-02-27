import React, { useState, useEffect, useCallback } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Sidebar from './Sidebar';
import Home from './Home';
import EventManagement from './EventManagement';
import GalleryForm from './GalleryForm';
import BannersForm from './BannersForm';
import MembersList from './MembersList';
import Settings from "./Settings";
import GFormLinksManager from './GFormLinksManager';

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
      case 'members':
        return <MembersList />;
      case 'forms':
        return <GFormLinksManager />;
      case 'settings':
        return <Settings />;
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-gradient-to-r from-blue-400 to-blue-200 min-h-screen">
      <Sidebar onSelect={setSelectedTab} selectedTab={selectedTab} />
      <div className="flex-grow ml-20 md:ml-64 p-4 md:p-8 transition-all">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-extrabold text-gray-200 mb-6">
            {selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1)}
          </h1>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
