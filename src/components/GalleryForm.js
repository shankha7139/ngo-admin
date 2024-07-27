import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TrashIcon, ImageIcon } from 'lucide-react';
import { ClipLoader } from 'react-spinners';

const GalleryForm = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `gallery/${file.name}`);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = await Promise.all(images.map(image => handleImageUpload(image)));
    await Promise.all(imageUrls.map(url => addDoc(collection(db, 'gallery'), { url })));
    setImages([]);
    setImagePreviews([]);
    fetchGalleryImages();
  };

  const fetchGalleryImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    setGalleryImages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-blue-500 text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">Upload Gallery Images</h2>
          <p className="mt-2 text-sm sm:text-base text-blue-100">Add new images to your gallery!</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6">
          <div>
            <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">Upload Images</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="images" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
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
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {imagePreviews.map((src, index) => (
              <div key={index} className="relative group">
                <img src={src} alt={`preview ${index}`} className="w-full h-32 sm:h-40 object-cover rounded-md" />
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
            className="w-full bg-blue-500 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:scale-105"
          >
            Upload to Gallery
          </button>
        </form>
        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-gray-50">
          <h3 className="text-xl font-bold mb-4 text-gray-800">Current Gallery Images</h3>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <ClipLoader color="#FFD700" size={50} />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleryImages.map((image) => (
                <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img src={image.url} alt="Gallery Image" className="h-40 w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GalleryForm;
