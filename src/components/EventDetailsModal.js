import React from 'react';
import { Dialog, DialogContent, DialogActions, Button, Typography, Box, Grid, Card, CardMedia, AppBar, Toolbar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EventDetailsModal = ({ event, open, onClose }) => {
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
            {event.name}
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
        <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>Description</Typography>
        <Typography variant="body1" paragraph>{event.description}</Typography>
        
        <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>Date</Typography>
        <Typography variant="body1" paragraph>{event.date}</Typography>
        
        <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 'bold' }}>Images</Typography>
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
    </Dialog>
  );
};

export default EventDetailsModal;