import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { TrashIcon, ImageIcon } from 'lucide-react';
import BouncingDotsLoader from './BouncingDotsLoader';
import ConfirmationDialog from './ConfirmationDialog';

const BannersForm = () => {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [bannerImages, setBannerImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
  const [deletingImage, setDeletingImage] = useState(null);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `banners/${file.name}`);
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

  const handleDeleteBannerImage = async (image) => {
    setLoading(true);
    try {
      const storageRef = ref(storage, image.url);
      await deleteObject(storageRef);
      await deleteDoc(doc(db, 'banners', image.id));
      setBannerImages(bannerImages.filter(img => img.id !== image.id));
    } catch (error) {
      console.error("Error deleting banner image: ", error);
    } finally {
      setLoading(false);
      setDeletingImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    try {
      const imageUrls = await Promise.all(images.map(image => handleImageUpload(image)));
      await Promise.all(imageUrls.map(url => addDoc(collection(db, 'banners'), { url })));
      setImages([]);
      setImagePreviews([]);
      fetchBannerImages();
    } catch (error) {
      console.error("Error uploading images: ", error);
    } finally {
      setUploading(false);
    }
  };

  const fetchBannerImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'banners'));
    setBannerImages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    setLoading(false);
  };

  useEffect(() => {
    fetchBannerImages();
  }, []);

  return (
    <div className="min-h-screen w-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-10 py-8 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <h2 className="text-2xl sm:text-3xl font-extrabold">
            Upload Banner Images
          </h2>
          <p className="mt-2 text-sm sm:text-base text-indigo-200">
            Add new banners to showcase your events!
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="px-6 py-4 sm:px-8 sm:py-6 space-y-4 sm:space-y-6"
        >
          <div>
            <label
              htmlFor="banners"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Upload Banners
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="banners"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload files</span>
                    <input
                      id="banners"
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
            className="w-full bg-indigo-600 text-white py-2 sm:py-3 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-150 ease-in-out transform hover:scale-105"
            disabled={uploading}
          >
            {uploading ? <BouncingDotsLoader /> : "Upload Banners"}
          </button>
        </form>
        <div className="px-6 py-4 sm:px-8 sm:py-6 bg-gray-50">
          <h3 className="text-xl font-bold mb-4 text-gray-800">
            Current Banner Images
          </h3>
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <BouncingDotsLoader />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {bannerImages.map((image) => (
                <div
                  key={image.id}
                  className="relative bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={image.url}
                    alt="Banner Image"
                    className="h-40 w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setDeletingImage(image);
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
        </div>
      </div>
      <ConfirmationDialog
        isOpen={confirmationDialogOpen}
        onClose={() => setConfirmationDialogOpen(false)}
        onConfirm={() => {
          setConfirmationDialogOpen(false);
          handleDeleteBannerImage(deletingImage);
        }}
      />
    </div>
  );
};

export default BannersForm;
