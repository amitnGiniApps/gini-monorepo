import React, { useState, useEffect } from 'react';
import {
  Container, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogActions
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';

const AdminPage: React.FC = () => {
  const [updates, setUpdates] = useState<string[]>([]);
  const [newInfo, setNewInfo] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: 'success' | 'error'}>({ open: false, message: '', severity: 'success' });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const SERVER_URL = 'http://localhost:3020';

  const fetchUpdates = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/list-model-info`);
      setUpdates(res.data.updates);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
      showSnackbar('Failed to load updates', 'error');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUpdates();
  }, []);

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleAdd = async () => {
    if (!newInfo.trim()) return;
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/add-model-info`, { newInfo });
      setNewInfo('');
      showSnackbar('Added successfully', 'success');
      fetchUpdates();
    } catch (error) {
      console.error('Failed to add model info:', error);
      showSnackbar('Failed to add info', 'error');
    }
    setLoading(false);
  };

  const handleEdit = (index: number, currentText: string) => {
    setEditingIndex(index);
    setEditingText(currentText);
  };

  const handleSave = async () => {
    if (editingIndex === null) return;
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/edit-model-info`, {
        index: editingIndex,
        newInfo: editingText,
      });
      setEditingIndex(null);
      setEditingText('');
      showSnackbar('Edited successfully', 'success');
      fetchUpdates();
    } catch (error) {
      console.error('Failed to edit model info:', error);
      showSnackbar('Failed to edit info', 'error');
    }
    setLoading(false);
  };

  const handleDeleteConfirmed = async () => {
    if (confirmDeleteIndex === null) return;
    setLoading(true);
    try {
      await axios.post(`${SERVER_URL}/delete-model-info`, { index: confirmDeleteIndex });
      setConfirmDeleteIndex(null);
      showSnackbar('Deleted successfully', 'success');
      fetchUpdates();
    } catch (error) {
      console.error('Failed to delete model info:', error);
      showSnackbar('Failed to delete info', 'error');
    }
    setLoading(false);
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
      <h1>Gini-Apps Model Admin</h1>

      {/* Add New Info */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <TextField
          label="Add New Info"
          variant="outlined"
          fullWidth
          value={newInfo}
          onChange={(e) => setNewInfo(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAdd} disabled={loading}>
          Add
        </Button>
      </div>

      {/* Loading Spinner */}
      {loading && (
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <CircularProgress />
        </div>
      )}

      {/* Info Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Info</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {updates.map((info, idx) => (
              <TableRow key={idx}>
                <TableCell>{idx + 1}</TableCell>

                <TableCell>
                  {editingIndex === idx ? (
                    <TextField
                      fullWidth
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                    />
                  ) : (
                    info
                  )}
                </TableCell>

                <TableCell>
                  {editingIndex === idx ? (
                    <>
                      <IconButton color="primary" onClick={handleSave}>
                        <Save />
                      </IconButton>
                      <IconButton color="secondary" onClick={() => { setEditingIndex(null); setEditingText(''); }}>
                        <Cancel />
                      </IconButton>
                    </>
                  ) : (
                    <div className='flex'>
                      <IconButton color="primary" onClick={() => handleEdit(idx, info)}>
                        <Edit />
                      </IconButton>
                      <IconButton color="error" onClick={() => setConfirmDeleteIndex(idx)}>
                        <Delete />
                      </IconButton>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {/* Confirm Delete Dialog */}
      <Dialog
        open={confirmDeleteIndex !== null}
        onClose={() => setConfirmDeleteIndex(null)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this info?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteIndex(null)}>Cancel</Button>
          <Button color="error" onClick={handleDeleteConfirmed}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminPage;
