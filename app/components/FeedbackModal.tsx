import React, { useState } from 'react';
import { Modal, TextField, Button, Box, Fade, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Send } from '@mui/icons-material';
const FeedbackModal = ({ open, onClose, onSubmit, title }) => {
  const [feedback, setFeedback] = useState('');

  const handleFeedbackChange = (event) => {
    setFeedback(event.target.value);
  };

  const handleSubmit = () => {
    onSubmit(feedback);
    setFeedback('');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="feedback-modal-title"
      aria-describedby="feedback-modal-description"
    >
      <Fade in={open}>
        <Box
            style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: 'black',
            padding: 20,
            borderRadius: 4,
            width: '40%',
            outline: 'none',
            }}
        >
             <Typography color={'#FFF'} id="modal-modal-title" variant="h6" component="h2">{title}</Typography>
            <TextField
            id="feedback-textfield"
            sx={{ bgcolor: '#000', color: '#fff', border: '.5px solid #EEE', borderRadius: '4px', marginTop: '8px'}}
            multiline
            rows={3}
            variant="outlined"
            fullWidth
            value={feedback}
            onChange={handleFeedbackChange}
            InputProps={{
                style: { color: '#fff' }, // Setting the color of the text to white
              }}
            />
            <Button sx={{ color: '#fff', marginTop: '16px'}} endIcon={<Send/>}  variant="contained" onClick={handleSubmit}>
            Submit
            </Button>
        </Box>
      </Fade>
    </Modal>
  );
};

export default FeedbackModal;