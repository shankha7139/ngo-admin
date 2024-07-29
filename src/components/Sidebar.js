import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import HomeIcon from '@mui/icons-material/Home';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import SettingsIcon from '@mui/icons-material/Settings';
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import Person3TwoTone from '@mui/icons-material/Person3TwoTone';
import Link from '@mui/icons-material/Link';
import LogoLight from '../assets/Logo_light.png';
import { auth } from '../firebase';
import ConfirmationDialogLogout from './ConfirmationDialogLogout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sidebar = ({ onSelect, selectedTab }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const showToast = () => {
    toast.info('Made by Shankharishi and Samriddha', {
      position: 'bottom-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      style: {
        backgroundColor: 'rgba(191, 219, 254, 1)', // bg-blue-200 with 20% opacity
        color: '#3b82f6', // text-blue-500
      },
    });
  };

  const handleSelect = (view) => {
    onSelect(view);
    if (!isExpanded) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsExpanded(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  const openDialog = () => {
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
  };

  const confirmLogout = () => {
    handleLogout();
    closeDialog();
  };

  const menuItems = [
    { name: 'home', icon: HomeIcon },
    { name: 'events', icon: EventIcon },
    { name: 'gallery', icon: PhotoLibraryIcon },
    { name: 'banners', icon: InsertPhotoIcon },
    { name: 'members', icon: Person3TwoTone },
    { name: 'forms', icon: Link },
    { name: 'settings', icon: SettingsIcon },
  ];

  return (
    <div className={`fixed inset-y-0 left-0 z-50 transition-all duration-300 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 shadow-xl ${isExpanded ? 'w-64' : 'w-20'} md:w-64`}>
      <div className="flex items-center justify-between h-16 bg-indigo-800 text-white px-4">
        <div className="flex items-center">
          <PersonIcon className={`mr-2 ${isExpanded ? 'inline-block' : 'hidden'} md:inline-block`} />
          <h2 className={`text-xl font-bold font-roboto ${isExpanded ? 'inline-block' : 'hidden'} md:inline-block`}>
            Admin Panel
          </h2>
        </div>
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
              <span className={`${isExpanded ? 'inline-block' : 'hidden'} md:inline-block text-left font-medium`}>
                {item.name.charAt(0).toUpperCase() + item.name.slice(1)}
              </span>
            </div>
          </button>
        ))}
      </nav>
      <div className={`absolute bottom-16 left-0 right-0 text-center`}>
        <img src={LogoLight} alt="Logo" className={`h-16 mx-auto my-4 ${isExpanded ? 'block' : 'hidden'} md:block`} />
        <div 
          onMouseEnter={showToast}
          className={`text-indigo-200 text-sm mt-4 ${isExpanded ? 'block' : 'hidden'} md:block`}
        >
          Version 1.0.1
        </div>
        <button
          onClick={openDialog}
          className="w-full flex items-center justify-center py-3 px-4 mt-4 rounded-lg text-indigo-100 hover:bg-red-600 hover:text-white transition-all duration-200"
        >
          <div className="flex items-center">
            <LockIcon className="mr-3 flex-shrink-0" />
            <span className={`${isExpanded ? 'inline-block' : 'hidden'} md:inline-block text-left font-medium`}>
              Logout
            </span>
          </div>
        </button>
      </div>
      <ConfirmationDialogLogout open={dialogOpen} onClose={closeDialog} onConfirm={confirmLogout} />
      <ToastContainer />
    </div>
  );
};

export default Sidebar;
