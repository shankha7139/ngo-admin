import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Button } from '@mui/material';

const ConfirmationDialogLogout = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      PaperProps={{
        style: {
          backgroundColor: '#3f51b5', // indigo-700
          borderRadius: '16px', // rounded corners
          padding: '20px', // padding for a more spacious look
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // subtle shadow for depth
        },
      }}
    >
      <DialogTitle id="alert-dialog-title" style={{ color: '#ffffff', fontSize: '1.25rem', fontWeight: 'bold' }}>
        Are you sure you want to log out?
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" style={{ color: '#ffffff', fontSize: '1rem', marginBottom: '20px' }}>
          Do you really want to log out? Any unsaved changes will be lost.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={onClose}
          style={{
            backgroundColor: '#5c6bc0', // indigo-500
            color: '#ffffff',
            borderRadius: '8px', // rounded corners
            padding: '10px 20px', // padding for a better button appearance
            marginRight: '10px',
            transition: 'background-color 0.3s', // smooth transition for hover effect
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#7986cb')} // indigo-400
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#5c6bc0')} // indigo-500
        >
          No
        </Button>
        <Button
          onClick={onConfirm}
          autoFocus
          style={{
            backgroundColor: '#d32f2f', // red-700
            color: '#ffffff',
            borderRadius: '8px', // rounded corners
            padding: '10px 20px', // padding for a better button appearance
            transition: 'background-color 0.3s', // smooth transition for hover effect
          }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e57373')} // red-600
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#d32f2f')} // red-700
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialogLogout;
