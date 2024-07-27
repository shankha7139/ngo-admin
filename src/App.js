// src/App.js
import React from 'react';
import MainLayout from './components/MainLayout';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MainLayout />
    </ThemeProvider>
  );
}

export default App;
