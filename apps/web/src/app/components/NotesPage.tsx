'use client';

import { 
  Add as AddIcon, 
  Search as SearchIcon, 
  Logout as LogoutIcon,
  Settings as SettingsIcon 
} from '@mui/icons-material';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  InputAdornment,
  Paper,
  TextField,
  Typography,
  IconButton,
} from '@mui/material';
import { Id, Note } from '@project/shared';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '../../libs/api-client';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { useCustomer } from '../../modules/customer/useCustomer';

export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useCustomer();
  
  const router = useRouter();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const { data } = await apiClient.get('/notes/')
      setNotes(data);
    } catch (error) {
      console.error('Failed to fetch notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const handleCreateNote = async (noteData: {
    title: string;
    content: string;
    tags: string[];
  }) => {
    try {
      const response = await apiClient.post('/notes/notes', noteData);
      if (response.status === 201) {
        setNotes((prev) => [response.data, ...prev]);
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (
    id: string,
    noteData: { title: string; content: string; tags: string[] }
  ) => {
    try {
      const { data } = await apiClient.put(`/notes/${id}`, noteData);
      setNotes((prev) =>
        prev.map((note) => (note._id === id as unknown as Id ? data : note))
      );
      setEditingNote(null);
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Delete this note?')) return;
    
    try {
      await apiClient.delete(`/notes/${id}`);
      setNotes((prev) => prev.filter((note) => note._id !== id as unknown as Id));
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  const handleLogout = () => {
    logout()
  };

  const handleSettings = () => {
    router.push('/app/settings');
  };

  if (loading) {
    return (
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
          My Notes
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ 
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' },
              textTransform: 'none',
              fontWeight: 500
            }}
          >
            New Note
          </Button>
          
          <IconButton onClick={handleSettings} title="Settings">
            <SettingsIcon />
          </IconButton>
          
          <IconButton onClick={handleLogout} title="Logout">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: 3
      }}>
        {/* Search */}
        <Box sx={{ mb: 3, maxWidth: 500 }}>
          <TextField
            fullWidth
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#64748b' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                '& fieldset': { borderColor: '#e2e8f0' },
                '&:hover fieldset': { borderColor: '#cbd5e1' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
            }}
          />
        </Box>

        {/* Stats */}
        <Typography variant="body2" sx={{ color: '#64748b', mb: 3 }}>
          {notes.length} {notes.length === 1 ? 'note' : 'notes'}
        </Typography>

        {/* Notes */}
        {filteredNotes.length === 0 ? (
          <Paper sx={{ 
            p: 6, 
            textAlign: 'center',
            backgroundColor: 'white',
            border: '1px solid #e2e8f0'
          }}>
            <Typography variant="h6" sx={{ color: '#64748b', mb: 2 }}>
              {searchQuery ? 'No notes found' : 'No notes yet'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="outlined"
                onClick={() => setIsCreateDialogOpen(true)}
                sx={{ textTransform: 'none' }}
              >
                Create your first note
              </Button>
            )}
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredNotes.map((note, index) => (
            
                <NoteCard
                  note={note}
                  onEdit={() => setEditingNote(note)}
                  onDelete={() => handleDeleteNote(note._id as unknown as string)}
                />
              
            ))}
          </Grid>
        )}
      </Box>

      {/* Dialogs */}
      <Dialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Create New Note</DialogTitle>
        <DialogContent>
          <NoteForm
            onSubmit={handleCreateNote}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!editingNote}
        onClose={() => setEditingNote(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Edit Note</DialogTitle>
        <DialogContent>
          {editingNote && (
            <NoteForm
              initialData={editingNote}
              onSubmit={(data) => handleUpdateNote(editingNote._id as unknown as string, data)}
              onCancel={() => setEditingNote(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Box>
  );
}