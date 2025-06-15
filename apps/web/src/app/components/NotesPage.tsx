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
    if (!confirm('Usunąć tą notatkę?')) return;
    
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
      }}>
        <CircularProgress sx={{ color: '#60a5fa' }} />
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
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ //#1e2328
        backgroundColor: '#6c28d9',
        borderBottom: '1px solid #374151',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0
      }}>
        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          NOTATKI
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsCreateDialogOpen(true)}
            sx={{ 
              backgroundColor: '#872ffa',
              fontWeight: 500,
              border: '1px white solid'
            }}
          >
            dodaj
          </Button>
          
          <IconButton 
            onClick={handleSettings} 
            title="Ustawienia"
            
          >
            <SettingsIcon />
          </IconButton>
          
          <IconButton 
            onClick={handleLogout} 
            title="Wyloguj"
          >
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
            placeholder="Wyszukaj notatki..."
            value={searchQuery}
            onChange={(e) => {setSearchQuery(e.target.value)}}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#f1f5f9',
                '& fieldset': { borderColor: '#374151' },
                '&:hover fieldset': { borderColor: '#4b5563' },
                '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
              },
              '& .MuiInputBase-input::placeholder': {
                color: '#9ca3af',
                opacity: 1,
              },
            }}
          />
        </Box>

        {/* Stats */}

        <Typography variant="body2" sx={{ color: '#9ca3af' }}>
          Suma posiadanych materiałów: {notes.length} {notes.length === 1 ? 'notatka' : 'notki'}
        </Typography>

        {/* Notes */}

        
        {filteredNotes.length === 0 ? (
          <Paper sx={{  
            textAlign: 'center',
            backgroundColor: '#1e2328',
            border: '1px solid #374151'
          }}>
            <Typography variant="h6" sx={{ color: '#9ca3af', mb: 2 }}>
              {searchQuery ? 'Nie znaleziono notatek' : 'Nie ma notatek'}
            </Typography>
            {!searchQuery && (
              <Button
                variant="outlined"
                onClick={() => setIsCreateDialogOpen(true)}
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#374151',
                  color: '#9ca3af',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#374151'
                  }
                }}
              >
                Stwórz swoją pierwszą notatkę!
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
        PaperProps={{
          sx: {
            backgroundColor: '#1e2328',
            color: '#f1f5f9'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', borderBottom: '1px solid #374151' }}>
          Stwórz nową notatkę
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e2328' }}>
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
        PaperProps={{
          sx: {
            backgroundColor: '#1e2328',
            color: '#f1f5f9'
          }
        }}
      >
        <DialogTitle sx={{ color: '#f1f5f9', borderBottom: '1px solid #374151' }}>
          Edytuj
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: '#1e2328' }}>
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