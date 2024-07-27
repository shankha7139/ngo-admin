// src/components/EventList.js
import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Typography, Card, CardContent, CardMedia, Grid } from '@mui/material';

const EventList = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const querySnapshot = await getDocs(collection(db, 'events'));
      setEvents(querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
    };

    fetchEvents();
  }, []);

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
