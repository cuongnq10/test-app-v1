import React, { useState, useRef, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
  CircularProgress,
} from '@mui/material';
import ReactQuill from 'react-quill';
import { DatePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import axios from 'axios';
import _ from 'lodash';

const FormLayout = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    btnContent: '',
    btnURL: '',
    showCTA: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isEditting, setIsEditting] = useState(false);
  const initialData = useRef({});

  function handleChange(fieldName, value) {
    setFormData((formData) => ({ ...formData, [fieldName]: value }));
  }
  function handleDiscard() {
    setFormData(initialData.current);
  }

  async function handleSave(e) {
    e.preventDefault();
    const id = 2;
    setError('');
    setSuccess(false);
    setIsLoading(true);
    try {
      if (isEditting) {
        await axios.put(`http://localhost:3000/notes/${id}`, formData);
      } else {
        await axios.post(`http://localhost:3000/notes`, formData);
      }
      setSuccess(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(function () {
    async function fetchInitialData() {
      setIsLoading(true);
      setError('');
      try {
        const id = 2;
        if (id) {
          const response = await axios.get(`http://localhost:3000/notes/${id}`);
          initialData.current = { ...response.data };
          setFormData({ ...response.data });
          setIsEditting(true);
        } else {
          initialData.current = {
            title: '',
            description: '',
            date: '',
            btnContent: '',
            btnURL: '',
            showCTA: false,
          };
          setFormData(initialData.current);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const isFormDirty = !_.isEqual(formData, initialData.current);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
      <Container maxWidth="md" sx={{ backgroundColor: 'white', p: 4, borderRadius: 2, boxShadow: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Version 6.4</Typography>
          <Box>
            {isFormDirty && <Button variant="outlined" sx={{ mr: 1 }} onClick={handleDiscard} disabled={isLoading}>
              Discard
            </Button>}
            <Button variant="contained" color="success" onClick={handleSave} disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save'}
            </Button>
          </Box>
        </Box>

        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Description"
            variant="outlined"
            multiline
            rows={5}
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            InputLabelProps={{ shrink: true }}
          />

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box display="flex" gap={2}>
              <DatePicker
                label="Date"
                value={dayjs(formData.date)}
                onChange={(value) => handleChange('date', value)}
                sx={{ width: '50%' }}
              />
            </Box>
          </LocalizationProvider>

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.showCTA}
                onChange={(e) => handleChange('showCTA', e.target.checked)}
              />
            }
            label="Show call to action"
          />

          {formData.showCTA && (
            <Box display="flex" gap={2}>
              <TextField
                fullWidth
                label="Button content"
                variant="outlined"
                sx={{ width: '50%' }}
                value={formData.btnContent}
                onChange={(e) => handleChange('btnContent', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                label="Button URL"
                variant="outlined"
                sx={{ width: '50%' }}
                value={formData.btnURL}
                onChange={(e) => handleChange('btnURL', e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          )}
        </Box>
      </Container>

      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={() => setSuccess(false)} severity="success">
          Saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FormLayout;
