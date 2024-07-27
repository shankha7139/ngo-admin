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
    <div className={`fixed inset-y-0 left-0 z-50 transition-all bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 shadow-md ${isExpanded ? 'w-60' : 'w-16'} md:w-60`}>
      <div className="flex items-center justify-between h-16 bg-blue-400 text-blue-800 px-4">
        <h2 className={`text-xl font-bold ${isExpanded ? 'block' : 'hidden md:block'}`}>
          Admin Panel
        </h2>
        <button className="md:hidden text-blue-800" onClick={toggleSidebar}>
          {isExpanded ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>
      <nav className="mt-8">
        {menuItems.map((item) => (
          <button
            key={item.name}
            onClick={() => handleSelect(item.name)}
            className={`w-full flex items-center py-3 px-4 transition-colors duration-200 ${
              selectedTab === item.name
                ? 'bg-blue-400 text-blue-800'
                : 'text-blue-800 hover:bg-blue-200'
            }`}
          >
            <div className="flex items-center w-full">
              <item.icon className="mr-3 flex-shrink-0" />
              <span className={`${isExpanded ? 'block' : 'hidden md:block'} text-left`}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </span>
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;