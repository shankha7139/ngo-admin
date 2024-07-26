import React, { useState } from "react";
import { motion } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { FaPlus, FaImage } from "react-icons/fa";

const firebaseConfig = {
  apiKey: "AIzaSyCUqEZklvL_n9rwZ2v78vxXWVv6z_2ALUE",
  authDomain: "matri-site-cf115.firebaseapp.com",
  projectId: "matri-site-cf115",
  storageBucket: "matri-site-cf115.appspot.com",
  messagingSenderId: "231063048901",
  appId: "1:231063048901:web:968969b3f06dd22f1096ac",
  measurementId: "G-351NC8Z306",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

function AdminDashboard() {
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventDuration, setEventDuration] = useState("");
  const [eventPhoto, setEventPhoto] = useState(null);
  const [galleryImage, setGalleryImage] = useState(null);

  const handleAddEvent = async (e) => {
    e.preventDefault();
    if (!eventPhoto) {
      alert("Please select an event photo");
      return;
    }

    try {
      const storageRef = ref(storage, `event_photos/${eventPhoto.name}`);
      await uploadBytes(storageRef, eventPhoto);
      const photoURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "events"), {
        name: eventName,
        date: eventDate,
        duration: eventDuration,
        photoURL: photoURL,
      });

      alert("Event added successfully");
      setEventName("");
      setEventDate("");
      setEventDuration("");
      setEventPhoto(null);
    } catch (error) {
      console.error("Error adding event: ", error);
      alert("Error adding event");
    }
  };

  const handleAddGalleryImage = async (e) => {
    e.preventDefault();
    if (!galleryImage) {
      alert("Please select a gallery image");
      return;
    }

    try {
      const storageRef = ref(storage, `gallery_images/${galleryImage.name}`);
      await uploadBytes(storageRef, galleryImage);
      const imageURL = await getDownloadURL(storageRef);

      await addDoc(collection(db, "gallery"), {
        imageURL: imageURL,
      });

      alert("Gallery image added successfully");
      setGalleryImage(null);
    } catch (error) {
      console.error("Error adding gallery image: ", error);
      alert("Error adding gallery image");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 py-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-12">
          Admin Dashboard
        </h1>

        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden mb-8"
        >
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Event</h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Name"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input
                type="text"
                placeholder="Event Duration"
                value={eventDuration}
                onChange={(e) => setEventDuration(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="event-photo"
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition"
                >
                  <span className="flex items-center justify-center">
                    <FaImage className="w-5 h-5 mr-2" />
                    {eventPhoto ? "Change Photo" : "Select Photo"}
                  </span>
                  <input
                    id="event-photo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setEventPhoto(e.target.files[0])}
                    required
                    className="hidden"
                  />
                </label>
                {eventPhoto && (
                  <span className="text-sm text-gray-500">
                    {eventPhoto.name}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FaPlus className="w-5 h-5 inline-block mr-2" />
                Add Event
              </motion.button>
            </form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="bg-white shadow-xl rounded-lg overflow-hidden"
        >
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Add Gallery Image
            </h2>
            <form onSubmit={handleAddGalleryImage} className="space-y-4">
              <div className="flex items-center space-x-2">
                <label
                  htmlFor="gallery-image"
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition"
                >
                  <span className="flex items-center justify-center">
                    <FaImage className="w-5 h-5 mr-2" />
                    {galleryImage ? "Change Image" : "Select Image"}
                  </span>
                  <input
                    id="gallery-image"
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryImage(e.target.files[0])}
                    required
                    className="hidden"
                  />
                </label>
                {galleryImage && (
                  <span className="text-sm text-gray-500">
                    {galleryImage.name}
                  </span>
                )}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <FaPlus className="w-5 h-5 inline-block mr-2" />
                Add Gallery Image
              </motion.button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;
