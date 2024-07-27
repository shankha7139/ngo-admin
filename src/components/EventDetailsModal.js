// src/components/EventDetailsModal.js
import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box, Grid, Card, CardMedia } from '@mui/material';

const EventDetailsModal = ({ event, open, onClose }) => {
  if (!event) return null;

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{event.name}</DialogTitle>
      <DialogContent>
        <Typography variant="h6">Description</Typography>
        <Typography variant="body1" paragraph>{event.description}</Typography>
        
        <Typography variant="h6">Date</Typography>
        <Typography variant="body1" paragraph>{event.date}</Typography>

        <Typography variant="h6">Images</Typography>
        <Grid container spacing={2}>
          {event.images.map((image, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardMedia component="img" height="140" image={image} alt={`Event Image ${index + 1}`} />
              </Card>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventDetailsModal;
