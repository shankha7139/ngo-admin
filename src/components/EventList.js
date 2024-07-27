// src/components/EventList.js
import React from 'react';
import { Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';

const EventList = ({ events }) => {
  return (
    <div>
      <Typography variant="h5" gutterBottom>
        Event List
      </Typography>
      <Grid container spacing={4}>
        {events.map(event => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card>
              {event.images.length > 0 && (
                <CardMedia
                  component="img"
                  height="140"
                  image={event.images[0]}
                  alt={event.name}
                />
              )}
              <CardContent>
                <Typography variant="h6">{event.name}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.description}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {event.date}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default EventList;
