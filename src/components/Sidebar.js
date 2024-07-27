import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';

const Sidebar = ({ onSelect, selectedTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSelect = (view) => {
    onSelect(view);
    if (!isExpanded) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const menuItems = [
    { name: 'home', icon: HomeIcon },
    { name: 'events', icon: EventIcon },
    { name: 'gallery', icon: PhotoLibraryIcon },
    { name: 'banners', icon: InsertPhotoIcon },
    { name: 'settings', icon: SettingsIcon },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 shadow-xl ${isExpanded ? 'w-64' : 'w-20'} md:w-64`}>
      <div className="flex items-center justify-between h-16 bg-indigo-800 text-white px-4">
        <h2 className={`text-xl font-bold ${isExpanded ? 'block' : 'hidden md:block'}`}>
          Admin Panel
        </h2>
        <button className="md:hidden text-white hover:text-indigo-200 transition-colors" onClick={toggleSidebar}>
          {isExpanded ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav className="mt-8 px-2">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleSelect(item.name)}
            className={`w-full flex items-center py-3 px-4 rounded-lg transition-all duration-200 ${
              selectedTab === item.name
                ? 'bg-indigo-500 text-white shadow-md'
                : 'text-indigo-100 hover:bg-indigo-600 hover:text-white'
            }`}
          >
            <div className="flex items-center w-full">
              <item.icon className="mr-3 flex-shrink-0" />
              <span className={`${isExpanded ? 'block' : 'hidden md:block'} text-left font-medium`}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </span>
            </div>
          </button>
        ))}
      </nav>
      <div className={`absolute bottom-4 left-0 right-0 text-center text-indigo-200 text-sm ${isExpanded ? 'block' : 'hidden md:block'}`}>
        Version 1.0.1
      </div>
    </div>
  );
};

export default Sidebar;
