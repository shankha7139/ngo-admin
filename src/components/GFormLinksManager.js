import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import {
  Search,
  Trash2,
  Edit2,
  Plus,
  LinkIcon,
  ExternalLink,
  Calendar,
  Clock,
} from "lucide-react";
import ConfirmationDialog from './ConfirmationDialog';
import BouncingDotsLoader from './BouncingDotsLoader';
import { motion } from "framer-motion";

const Button = ({ children, onClick, className, ...props }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 rounded-md font-medium transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input = ({ className, ...props }) => (
  <input
    className={`w-full px-4 py-2 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}
    {...props}
  />
);

const Card = ({ children, className, ...props }) => (
  <div
    className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl ${className}`}
    {...props}
  >
    {children}
  </div>
);

const EventCard = ({ link, onEdit, onDelete }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      className="bg-blue-200 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      <div className="p-6 space-y-4 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="font-bold text-2xl text-blue-800 mb-2">
            {link.eventName}
          </h3>
          <div className="flex items-center text-sm text-blue-700 mb-4">
            <Calendar size={16} className="mr-2" />
            <span>Event Date: Coming Soon</span>
          </div>
          <div className="flex items-center text-sm text-blue-700 mb-4">
            <Clock size={16} className="mr-2" />
            <span>Duration: TBA</span>
          </div>
          <div className="flex items-center text-sm text-blue-700 mb-4">
            <LinkIcon size={16} className="mr-2" />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 hover:text-blue-900 hover:underline truncate flex items-center"
            >
              {link.url}
              <ExternalLink size={14} className="ml-1" />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="flex justify-between items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-colors duration-300"
            onClick={() => window.open(link.url, "_blank")}
          >
            Open Form
          </motion.button>

          <div className="space-x-2">
            <motion.button
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full transition-colors duration-300"
              onClick={() => onDelete(link)}
            >
              <Trash2 size={16} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1, rotate: -15 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full transition-colors duration-300"
              onClick={() => onEdit(link)}
            >
              <Edit2 size={16} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const GFormLinksManager = () => {
  const [gformLinks, setGformLinks] = useState([]);
  const [filteredGformLinks, setFilteredGformLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newLink, setNewLink] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkToDelete, setLinkToDelete] = useState(null);
  const [editingLink, setEditingLink] = useState(null);

  const fetchGFormLinks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'gformLinks'));
      const gformLinksData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
      setGformLinks(gformLinksData);
      setFilteredGformLinks(gformLinksData);
    } catch (error) {
      console.error("Error fetching Google Form links: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGFormLinks();
  }, []);

  useEffect(() => {
    const results = gformLinks.filter(link =>
      Object.values(link).some(value =>
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    setFilteredGformLinks(results);
  }, [searchTerm, gformLinks]);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAddLink = async () => {
    if (newLink.trim() === '' || newEventName.trim() === '') return;
    try {
      const docRef = await addDoc(collection(db, 'gformLinks'), { url: newLink, eventName: newEventName });
      const newLinkData = { url: newLink, eventName: newEventName, id: docRef.id };
      setGformLinks([...gformLinks, newLinkData]);
      setFilteredGformLinks([...gformLinks, newLinkData]);
      setNewLink('');
      setNewEventName('');
    } catch (error) {
      console.error("Error adding new Google Form link: ", error);
    }
  };

  const handleDeleteClick = (link) => {
    setLinkToDelete(link);
    setIsDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (linkToDelete) {
      try {
        await deleteDoc(doc(db, 'gformLinks', linkToDelete.id));
        setGformLinks(gformLinks.filter(link => link.id !== linkToDelete.id));
        setFilteredGformLinks(filteredGformLinks.filter(link => link.id !== linkToDelete.id));
      } catch (error) {
        console.error("Error deleting Google Form link: ", error);
      } finally {
        setIsDialogOpen(false);
        setLinkToDelete(null);
      }
    }
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setLinkToDelete(null);
  };

  const handleEditClick = (link) => {
    setEditingLink({ ...link });
  };

  const handleEditSave = async () => {
    if (editingLink) {
      try {
        await updateDoc(doc(db, 'gformLinks', editingLink.id), {
          url: editingLink.url,
          eventName: editingLink.eventName
        });
        setGformLinks(gformLinks.map(link => link.id === editingLink.id ? editingLink : link));
        setFilteredGformLinks(filteredGformLinks.map(link => link.id === editingLink.id ? editingLink : link));
        setEditingLink(null);
      } catch (error) {
        console.error("Error updating Google Form link: ", error);
      }
    }
  };

  const handleEditCancel = () => {
    setEditingLink(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-hidden shadow-2xl">
          <div className="px-6 py-8 sm:px-10 sm:py-12 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-6 sm:mb-0">
                <h2 className="text-4xl font-extrabold text-white tracking-tight">
                  Events Forms Manager
                </h2>
                <p className="mt-2 text-blue-100 text-lg">
                  Streamline your form management process
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search links or events..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-3 w-full sm:w-72 bg-white bg-opacity-90 text-blue-600 placeholder-gray-400 border-none"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-6 py-8 sm:px-10 sm:py-12 bg-white">
            <Card className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner">
              <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Input
                  type="text"
                  placeholder="Event Name"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="w-full sm:w-64 bg-white"
                />
                <Input
                  type="text"
                  placeholder="Google Form link"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="w-full sm:w-64 bg-white"
                />
                <Button
                  onClick={handleAddLink}
                  className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md"
                >
                  <Plus className="inline-block mr-2 h-5 w-5" /> Add Link
                </Button>
              </div>
            </Card>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <BouncingDotsLoader />
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredGformLinks.map((link) => (
                  <EventCard
                    key={link.id}
                    link={link}
                    onEdit={() => handleEditClick(link)}
                    onDelete={() => handleDeleteClick(link)}
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
      <ConfirmationDialog
        isOpen={isDialogOpen}
        onClose={handleDialogClose}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default GFormLinksManager;