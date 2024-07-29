import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Search, Trash2, Edit2, Plus, Link as LinkIcon, X } from 'lucide-react';
import ConfirmationDialog from './ConfirmationDialog';
import BouncingDotsLoader from './BouncingDotsLoader';

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
                <h2 className="text-4xl font-extrabold text-white tracking-tight">Events Forms Manager</h2>
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
                    className="pl-10 pr-4 py-3 w-full sm:w-72 bg-white bg-opacity-20 text-white placeholder-blue-200 border-none"
                  />
                  <Search className="absolute left-3 top-3 h-5 w-5 text-blue-200" />
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
                  <Card key={link.id} className="group">
                    <div className="p-6 space-y-3 relative">
                      {editingLink && editingLink.id === link.id ? (
                        <div className="space-y-3">
                          <Input
                            type="text"
                            value={editingLink.eventName}
                            onChange={(e) => setEditingLink({ ...editingLink, eventName: e.target.value })}
                            className="w-full mb-2"
                          />
                          <Input
                            type="text"
                            value={editingLink.url}
                            onChange={(e) => setEditingLink({ ...editingLink, url: e.target.value })}
                            className="w-full mb-2"
                          />
                          <div className="flex space-x-2">
                            <Button
                              onClick={handleEditSave}
                              className="w-full bg-green-500 text-white hover:bg-green-600"
                            >
                              Save
                            </Button>
                            <Button
                              onClick={handleEditCancel}
                              className="w-full bg-gray-300 text-gray-800 hover:bg-gray-400"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <div className="absolute top-2 right-2 space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <Button
                              className="p-2 bg-red-500 text-white hover:bg-red-600 rounded-full"
                              onClick={() => handleDeleteClick(link)}
                            >
                              <Trash2 size={16} />
                            </Button>
                            <Button
                              className="p-2 bg-blue-500 text-white hover:bg-blue-600 rounded-full"
                              onClick={() => handleEditClick(link)}
                            >
                              <Edit2 size={16} />
                            </Button>
                          </div>
                          <h3 className="font-semibold text-xl text-indigo-700">{link.eventName}</h3>
                          <div className="flex items-center text-sm text-gray-600">
                            <LinkIcon size={16} className="mr-2 text-indigo-500" />
                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline truncate">
                              {link.url}
                            </a>
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
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