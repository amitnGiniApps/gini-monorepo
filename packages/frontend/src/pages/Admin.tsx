import React, { useCallback, useEffect, useState } from 'react';
import {
  Box, Container, TextField, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper,
  IconButton, CircularProgress, Snackbar, Dialog, DialogTitle,
  DialogContent, DialogActions, Typography
} from '@mui/material';
import { Edit, Delete, Save, Cancel } from '@mui/icons-material';
import axios from 'axios';
import Page from "./Page.tsx";

const AdminPage: React.FC = () => {
  const [updates, setUpdates] = useState<string[]>([]);
  const [newInfo, setNewInfo] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean, message: string, severity: 'success' | 'error' }>({ open: false, message: '', severity: 'success' });
  const [confirmDeleteIndex, setConfirmDeleteIndex] = useState<number | null>(null);

  const SERVER_URL = 'http://localhost:3020';

  const fetchUpdates = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${SERVER_URL}/list-model-info`);
      setUpdates(res.data.updates);
    } catch (error) {
      console.error('Failed to fetch model info:', error);
      showSnackbar('Failed to load updates', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUpdates();
  }, [fetchUpdates]);

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
      <Page>
      <Container width="80%">
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Admin Panel
        </Typography>

        <Box display="flex" gap={2} mb={4}>
          <TextField
              label="New Info"
              variant="outlined"
              fullWidth
              value={newInfo}
              onChange={(e) => setNewInfo(e.target.value)}
          />
          <Button variant="contained" onClick={handleAdd} disabled={loading} sx={{ borderRadius: 3 }}>
            Add
          </Button>
        </Box>

        {loading && (
            <Box display="flex" justifyContent="center" mb={2}>
              <CircularProgress />
            </Box>
        )}

        <TableContainer
            component={Paper}
            elevation={2}
            sx={{
              borderRadius: 3,
              maxHeight: 600, // Set the scrollable height here
              overflowY: 'auto',
              width:'100%'
            }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>#</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Info</TableCell>
                <TableCell sx={{ fontWeight: 'bold', backgroundColor: 'background.paper' }}>Actions</TableCell>
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
                              size="small"
                              value={editingText}
                              onChange={(e) => setEditingText(e.target.value)}
                          />
                      ) : (
                          <Typography variant="body2">{info}</Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingIndex === idx ? (
                          <div className="flex flex-row">
                            <IconButton onClick={handleSave}>
                              <Save/>
                            </IconButton>
                            <IconButton onClick={() => {
                              setEditingIndex(null);
                              setEditingText('');
                            }}>
                              <Cancel/>
                            </IconButton>
                          </div>
                      ) : (
                          <div className="flex flex-row">
                        <IconButton onClick={() => handleEdit(idx, info)}>
                        <Edit />
                        </IconButton>
                        <IconButton color="error" onClick={() => setConfirmDeleteIndex(idx)}>
                      <Delete/>
                    </IconButton>
                  </div>
              )}
            </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>


        <Snackbar
            open={snackbar.open}
            autoHideDuration={3000}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            message={snackbar.message}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        <Dialog
            open={confirmDeleteIndex !== null}
            onClose={() => setConfirmDeleteIndex(null)}
        >
          <DialogTitle>Delete Info</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this item?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeleteIndex(null)}>Cancel</Button>
            <Button variant="contained" color="error" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
      </Page>
  );
};

export default AdminPage;
