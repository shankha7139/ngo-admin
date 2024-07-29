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

const Input = ({ id, label, className, ...props }) => (
  <div className="flex flex-col">
    <label htmlFor={id} className="mb-2 font-medium text-gray-700">
      {label}
    </label>
    <input
      id={id}
      className={`w-full px-3 py-2 text-sm border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 ${className}`}
      {...props}
    />
  </div>
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
      className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl"
    >
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 rounded-t-xl">
        <h3 className="font-bold text-xl text-white truncate">
          {link.eventName}
        </h3>
      </div>
      <div className="p-4 space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Calendar size={16} className="mr-2 text-blue-500" />
            <span>Event Date: {link.eventDate || 'Coming Soon'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 mb-2">
            <Clock size={16} className="mr-2 text-blue-500" />
            <span>Last Day to Register: {link.lastDayToRegister || 'TBA'}</span>
          </div>
          {/* <div className="flex items-center text-sm text-gray-600">
            <LinkIcon size={16} className="mr-2 flex-shrink-0 text-blue-500" />
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 hover:underline truncate flex items-center"
            >
              {link.url}
              <ExternalLink size={14} className="ml-1 flex-shrink-0" />
            </a>
          </div> */}
        </motion.div>

        <motion.div
          className="flex justify-between items-center pt-3 border-t border-gray-200"
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
  const [newEventDate, setNewEventDate] = useState('');
  const [newLastDayToRegister, setNewLastDayToRegister] = useState('');
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
    if (newLink.trim() === '' || newEventName.trim() === '' || newEventDate.trim() === '' || newLastDayToRegister.trim() === '') return;
    try {
      const docRef = await addDoc(collection(db, 'gformLinks'), {
        url: newLink,
        eventName: newEventName,
        eventDate: newEventDate,
        lastDayToRegister: newLastDayToRegister
      });
      const newLinkData = {
        url: newLink,
        eventName: newEventName,
        eventDate: newEventDate,
        lastDayToRegister: newLastDayToRegister,
        id: docRef.id
      };
      setGformLinks([...gformLinks, newLinkData]);
      setFilteredGformLinks([...gformLinks, newLinkData]);
      setNewLink('');
      setNewEventName('');
      setNewEventDate('');
      setNewLastDayToRegister('');
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
          eventName: editingLink.eventName,
          eventDate: editingLink.eventDate,
          lastDayToRegister: editingLink.lastDayToRegister
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Card className="overflow-hidden shadow-2xl">
          <div className="px-4 py-6 sm:px-6 sm:py-8 bg-gradient-to-r from-blue-600 to-indigo-600">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Events Forms Manager
                </h2>
                <p className="mt-2 text-blue-100 text-base sm:text-lg">
                  Streamline your form management process
                </p>
              </div>
              <div className="w-full sm:w-auto">
                <div className="relative">
                  <Input
                    id="search"
                    label="______________________________"
                    type="text"
                    placeholder="Search links or events..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10 pr-4 py-2 w-full sm:w-64 bg-white bg-opacity-90 text-blue-600 placeholder-gray-400 border-none text-sm"
                  />
                  <Search className="absolute left-3 top-10 h-4 w-4 text-blue-600" />
                </div>
              </div>
            </div>
          </div>
          <div className="px-4 py-6 sm:px-6 sm:py-8 bg-white">
            <Card className="mb-6 p-4 sm:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-inner">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  id="eventName"
                  label="Event Name"
                  type="text"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="bg-white text-sm"
                />
                <Input
                  id="formLink"
                  label="Google Form Link"
                  type="text"
                  value={newLink}
                  onChange={(e) => setNewLink(e.target.value)}
                  className="bg-white text-sm"
                />
                <Input
                  id="eventDate"
                  label="Event Date"
                  type="date"
                  value={newEventDate}
                  onChange={(e) => setNewEventDate(e.target.value)}
                  className="bg-white text-sm"
                />
                <Input
                  id="lastDayToRegister"
                  label="Last Day to Register"
                  type="date"
                  value={newLastDayToRegister}
                  onChange={(e) => setNewLastDayToRegister(e.target.value)}
                  className="bg-white text-sm"
                />
              </div>
              <Button
                onClick={handleAddLink}
                className="mt-4 w-full sm:w-1/3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 shadow-md mx-auto flex items-center justify-center text-sm"
              >
                <Plus className="inline-block mr-2 h-4 w-4" /> Add Link
              </Button>
            </Card>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <BouncingDotsLoader />
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
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
      {editingLink && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <Card className="p-4 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Link</h2>
            <div className="flex flex-col space-y-4">
              <Input
                id="editEventName"
                label="Event Name"
                type="text"
                value={editingLink.eventName}
                onChange={(e) => setEditingLink({ ...editingLink, eventName: e.target.value })}
                className="text-sm"
              />
              <Input
                id="editFormLink"
                label="Google Form Link"
                type="text"
                value={editingLink.url}
                onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                className="text-sm"
              />
              <Input
                id="editEventDate"
                label="Event Date"
                type="date"
                value={editingLink.eventDate}
                onChange={(e) => setEditingLink({ ...editingLink, eventDate: e.target.value })}
                className="text-sm"
              />
              <Input
                id="editLastDayToRegister"
                label="Last Day to Register"
                type="date"
                value={editingLink.lastDayToRegister}
                onChange={(e) => setEditingLink({ ...editingLink, lastDayToRegister: e.target.value })}
                className="text-sm"
              />
            </div>
            <div className="flex justify-end space-x-4 mt-4">
              <Button
                onClick={handleEditSave}
                className="bg-blue-500 text-white hover:bg-blue-600 text-sm"
              >
                Save
              </Button>
              <Button
                onClick={handleEditCancel}
                className="bg-gray-500 text-white hover:bg-gray-600 text-sm"
              >
                Cancel
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};

export default GFormLinksManager;