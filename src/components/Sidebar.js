// src/components/Sidebar.js
import React, { useState } from 'react';
import { List, ListItem, Divider, Toolbar, Typography, IconButton } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MenuIcon from '@mui/icons-material/Menu';

const Sidebar = ({ onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-transform transform bg-white shadow-md ${isExpanded ? 'w-60' : 'w-16'} md:w-60`}>
      <Toolbar className="flex items-center justify-between h-16 bg-gray-800 text-white">
        <Typography variant="h6" noWrap className={`${isExpanded ? 'block' : 'hidden md:block'}`}>
          Admin Panel
        </Typography>
        <IconButton className="md:hidden" onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List className="p-2">
        <ListItem button onClick={() => { onSelect('home'); if (!isExpanded) toggleSidebar(); }} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
          <HomeIcon className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden md:block'}`}>Home</span>
        </ListItem>
        <ListItem button onClick={() => { onSelect('events'); if (!isExpanded) toggleSidebar(); }} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
          <EventIcon className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden md:block'}`}>Events</span>
        </ListItem>
        <ListItem button onClick={() => { onSelect('gallery'); if (!isExpanded) toggleSidebar(); }} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
          <PhotoLibraryIcon className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden md:block'}`}>Gallery</span>
        </ListItem>
        <ListItem button onClick={() => { onSelect('banners'); if (!isExpanded) toggleSidebar(); }} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
          <InsertPhotoIcon className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden md:block'}`}>Banners</span>
        </ListItem>
        <ListItem button onClick={() => { onSelect('settings'); if (!isExpanded) toggleSidebar(); }} className="flex items-center p-2 hover:bg-gray-200 cursor-pointer">
          <SettingsIcon className="mr-3" />
          <span className={`${isExpanded ? 'block' : 'hidden md:block'}`}>Settings</span>
        </ListItem>
      </List>
    </div>
  );
};

export default Sidebar;
