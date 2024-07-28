import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { TrashIcon, CalendarIcon, ImageIcon } from 'lucide-react';
import BouncingDotsLoader from './BouncingDotsLoader';
import EventDetailsModal from './EventDetailsModal';
import ConfirmationDialog from './ConfirmationDialog';

const EventManagement = () => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletingEvent, setDeletingEvent] = useState(null);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `events/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prevImages => [...prevImages, ...files]);
    setImagePreviews(prevPreviews => [...prevPreviews, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleDeleteEvent = async (event) => {
    setLoading(true);
    try {
      await Promise.all(event.images.map(async (url) => {
        const storageRef = ref(storage, url);
        await deleteObject(storageRef);
      }));

      await deleteDoc(doc(db, 'events', event.id));

      setEvents(events.filter(e => e.id !== event.id));
    } catch (error) {
      console.error("Error deleting event: ", error);
    } finally {
      setLoading(false);
      setDeletingEvent(null);
    }
  };

  const handleSaveEvent = async (updatedEvent) => {
    setFormLoading(true);
    try {
      const newImageUrls = await Promise.all(updatedEvent.newImages.map(image => handleImageUpload(image)));
      const allImages = [...updatedEvent.images, ...newImageUrls];

      await updateDoc(doc(db, 'events', updatedEvent.id), {
        name: updatedEvent.name,
        description: updatedEvent.description,
        date: updatedEvent.date,
        images: allImages,
      });

      setEvents(events.map(event => (event.id === updatedEvent.id ? { ...updatedEvent, images: allImages } : event)));
    } catch (error) {
      console.error("Error updating event: ", error);
    } finally {
      setFormLoading(false);
      setModalOpen(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    const imageUrls = await Promise.all(images.map(image => handleImageUpload(image)));
    await addDoc(collection(db, 'events'), {
      name,
      description,
      date,
      images: imageUrls,
    });
    setName('');
    setDescription('');
    setDate('');
    setImages([]);
    setImagePreviews([]);
    setFormLoading(false);
    fetchEvents();
  };

  const fetchEvents = async () => {
    const querySnapshot = await getDocs(collection(db, 'events'));
    setEvents(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleOpenModal = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedEvent(null);
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen rounded-xl w-full bg-gradient-to-br from-orange-200 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden mb-8">
        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-indigo-600 text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Create New Event
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-200">
            Fill in the details to create your amazing event!
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="relative px-6 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6"
        >
          {formLoading && (
            <div className="absolute inset-0 bg-white bg-opacity-75 flex justify-center items-center">
              <BouncingDotsLoader />
            </div>
          )}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              placeholder="Enter event name"
            />
          </div>
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              placeholder="Describe your event"
            />
          </div>
          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Date
            </label>
            <div className="relative">
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              />
              <CalendarIcon className="absolute left-3 top-2 text-gray-400 w-5 h-5" />
            </div>
          </div>
          <div>
            <label
              htmlFor="images"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Images
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="images"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="images"
                      type="file"
                      multiple
                      onChange={handleImageChange}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img
                  src={src}
                  alt={`preview ${index}`}
                  className="w-full h-32 sm:h-40 object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => handleDeleteImage(index)}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className={`w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md transition duration-150 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
              formLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-indigo-700"
            }`}
            disabled={formLoading}
          >
            Create Event
          </button>
        </form>
      </div>
      <div className="w-full rounded-xl max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-indigo-500">
        <h2 className="text-3xl font-extrabold text-orange-100 mb-6">
          Event List
        </h2>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <BouncingDotsLoader />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 transform hover:scale-105 cursor-pointer"
                onClick={() => handleOpenModal(event)}
              >
                {event.images.length > 0 && (
                  <div className="h-48 w-full overflow-hidden">
                    <img
                      src={event.images[0]}
                      alt={event.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-indigo-800 mb-2">
                    {event.name}
                  </h3>
                  <p className="text-indigo-700 text-sm mb-2 line-clamp-2">
                    {event.description}
                  </p>
                  <p className="text-indigo-600 text-sm font-medium">
                    {event.date}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeletingEvent(event);
                    setConfirmationDialogOpen(true);
                  }}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full transition-opacity duration-200 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        <EventDetailsModal
          event={selectedEvent}
          open={modalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveEvent}
        />
      </div>
      <ConfirmationDialog
        isOpen={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={() => {
          setConfirmationDialogOpen(false);
          handleDeleteEvent(deletingEvent);
        }}
      />
    </div>
  );
};

export default EventManagement;
