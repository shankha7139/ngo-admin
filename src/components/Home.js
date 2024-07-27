import React, { useState, useEffect } from 'react';
import BouncingDotsLoader from './BouncingDotsLoader'; // Import the new loader

const Home = ({ events, galleryImages, bannerImages }) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-800 mb-6">Welcome, Sir!</h1>
      <p className="text-lg sm:text-xl text-blue-800 mb-10">
        This is your admin panel. Use the tabs on the left to manage events, gallery, banners, and settings.
      </p>
      
      {loading ? (
        <div className="flex justify-center items-center h-48">
          <BouncingDotsLoader /> {/* Use the new loader */}
        </div>
      ) : (
        <>
          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6">Events</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(event => (
                <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  {event.images.length > 0 && (
                    <img className="h-40 w-full object-cover" src={event.images[0]} alt={event.name} />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">{event.name}</h3>
                    <p className="text-blue-700 text-sm mb-2 line-clamp-2">{event.description}</p>
                    <p className="text-blue-600 text-sm font-medium">{event.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-10">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6">Gallery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryImages.map(image => (
                <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105">
                  <img className="h-40 w-full object-cover" src={image.url} alt="Gallery Image" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-800 mb-6">Banners</h2>
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
