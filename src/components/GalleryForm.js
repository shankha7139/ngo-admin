// src/components/GalleryForm.js
import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button, Typography, Paper, Box, Grid, Card } from '@mui/material';

const GalleryForm = () => {
  const [images, setImages] = useState([]);
  const [galleryImages, setGalleryImages] = useState([]);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `gallery/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imageUrls = await Promise.all(images.map(image => handleImageUpload(image)));
    await Promise.all(imageUrls.map(url => addDoc(collection(db, 'gallery'), { url })));
    setImages([]);
    fetchGalleryImages();
  };

  const fetchGalleryImages = async () => {
    const querySnapshot = await getDocs(collection(db, 'gallery'));
    setGalleryImages(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
  };

  useEffect(() => {
    fetchGalleryImages();
  }, []);

  return (
    <Paper className="p-4 mb-4 shadow-md">
      <Typography variant="h5" gutterBottom>
        Upload Gallery Images
      </Typography>
      <Box component="form" onSubmit={handleSubmit} className="space-y-4">
        <Button variant="contained" component="label" className="w-full">
          Upload Images
          <input type="file" multiple hidden onChange={(e) => setImages([...e.target.files])} />
        </Button>
        <Button type="submit" variant="contained" color="primary" className="w-full">
          Upload to Gallery
        </Button>
      </Box>
      <Grid container spacing={4} className="mt-4">
        {galleryImages.map((image) => (
          <Grid item key={image.id} xs={12} sm={6} md={4}>
            <Card className="shadow-md">
              <Box className="h-36 w-full overflow-hidden">
                <img src={image.url} alt="Gallery Image" className="w-full h-full object-cover" />
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default GalleryForm;
