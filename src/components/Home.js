// src/components/Home.js
import React, { useState, useEffect } from 'react';
import BouncingDotsLoader from './BouncingDotsLoader';

const Home = ({ events, galleryImages, bannerImages }) => {
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 py-8 px-4 sm:px-6 lg:px-8 relative">
      <button
        onClick={loadData}
        className="absolute top-1 right-4 py-1 px-3 sm:py-2 sm:px-4 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 text-sm sm:text-base"
      >
        Refresh
      </button>

      <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6">Welcome, Sir!</h1>
      <p className="text-lg sm:text-xl text-white mb-10">
        This is your admin panel. Use the tabs on the left to manage events, gallery, banners, and settings.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <BouncingDotsLoader />
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  {event.images.length > 0 && (
                    <img className="h-40 w-full object-cover" src={event.images[0]} alt={event.name} />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-indigo-800 mb-2">{event.name}</h3>
                    <p className="text-indigo-700 text-sm mb-2 line-clamp-2">{event.description}</p>
                    <p className="text-indigo-600 text-sm font-medium">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-indigo-400 my-10"></div>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map(image => (
                <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  <img className="h-40 w-full object-cover" src={image.url} alt="Gallery Image" />
                </div>
              ))}
            </div>
          </section>

          <div className="border-t border-indigo-400 my-10"></div>

          <section>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6">Banners</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {bannerImages.map(image => (
                <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  <img className="h-40 w-full object-cover" src={image.url} alt="Banner Image" />
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default Home;
