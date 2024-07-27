import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Grid, Card, CardMedia, AppBar, Toolbar, TextField, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon from '@mui/icons-material/Delete';
import BouncingDotsLoader from './BouncingDotsLoader';

const EventDetailsModal = ({ event, open, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [images, setImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDescription(event.description);
      setDate(event.date);
      setImages(event.images);
      setNewImages([]);
      setImagePreviews([]);
    }
  }, [event]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prevImages => [...prevImages, ...files]);
    setImagePreviews(prevPreviews => [...prevPreviews, ...files.map(file => URL.createObjectURL(file))]);
  };

  const handleDeleteImage = (index) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleDeleteNewImage = (index) => {
    setNewImages(prevImages => prevImages.filter((_, i) => i !== index));
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setLoading(true);
    const updatedEvent = { ...event, name, description, date, images, newImages };
    await onSave(updatedEvent);
    setLoading(false);
  };

  if (!event) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md" 
      sx={{
        '& .MuiDialog-paper': {
          background: 'linear-gradient(to bottom right, #ebf8ff, #d0e7ff, #b1d6ff)', 
          color: '#1e40af',
          overflow: 'hidden',
        },
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: '#1e40af' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold', flexGrow: 1 }}>
            Edit Event
          </Typography>
          <Button 
            onClick={onClose}
            sx={{
              color: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            <CloseIcon />
          </Button>
        </Toolbar>
      </AppBar>
      <DialogContent sx={{ mt: 2 }}>
        {loading && (
          <Box display="flex" justifyContent="center" alignItems="center" sx={{ mb: 2 }}>
            <BouncingDotsLoader />
          </Box>
        )}
        <TextField
          label="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={4}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          fullWidth
          InputLabelProps={{
            shrink: true,
          }}
          sx={{ mb: 2 }}
          disabled={loading}
        />
        <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>Images</Typography>
        <Grid container spacing={2}>
          {images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ position: 'relative' }}>
              <Card>
                <CardMedia component="img" height="140" image={image} alt={`Event Image ${index + 1}`} />
                <IconButton 
                  onClick={() => handleDeleteImage(index)} 
                  sx={{ 
                    position: 'absolute', 
                    top: '5px', 
                    right: '5px', 
                    color: 'white', 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    '&:hover': {
                      backgroundColor: 'red',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
          {imagePreviews.map((preview, index) => (
            <Grid item xs={12} sm={6} md={4} key={index} sx={{ position: 'relative' }}>
              <Card>
                <CardMedia component="img" height="140" image={preview} alt={`New Event Image ${index + 1}`} />
                <IconButton 
                  onClick={() => handleDeleteNewImage(index)} 
                  sx={{ 
                    position: 'absolute', 
                    top: '5px', 
                    right: '5px', 
                    color: 'white', 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    '&:hover': {
                      backgroundColor: 'red',
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Card>
            </Grid>
          ))}
        </Grid>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          style={{ marginTop: '16px' }}
          disabled={loading}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary" disabled={loading}>Cancel</Button>
        <Button onClick={handleSave} color="primary" disabled={loading}>Save</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
