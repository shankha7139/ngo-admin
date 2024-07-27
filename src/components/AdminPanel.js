// src/components/AdminPanel.js
import React from 'react';
import EventForm from './EventForm';
import EventList from './EventList';
import { Container, Typography } from '@mui/material';

const AdminPanel = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <EventForm />
      <EventList />
    </Container>
  );
};

export default AdminPanel;
