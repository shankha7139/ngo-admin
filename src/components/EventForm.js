// src/components/EventForm.js
import React, { useState } from 'react';
import { db, storage } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Typography, Paper } from '@mui/material';

const EventForm = ({ onEventAdded }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);

  const handleImageUpload = async (file) => {
    const storageRef = ref(storage, `events/${file.name}`);
    await uploadBytes(storageRef, file);
    return getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
    onEventAdded(); // Call the function to refresh the event list
  };

  return (
    <Paper className="p-4 mb-4 shadow-md">
      <Typography variant="h5" gutterBottom>
        Create Event
      </Typography>
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextField
          label="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          label="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          multiline
          rows={4}
          fullWidth
        />
        <TextField
          label="Event Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <Button variant="contained" component="label" className="w-full">
          Upload Images
          <input type="file" multiple hidden onChange={(e) => setImages([...e.target.files])} />
        </Button>
        <Button type="submit" variant="contained" color="primary" className="w-full">
          Create Event
        </Button>
      </form>
    </Paper>
  );
};

export default EventForm;
