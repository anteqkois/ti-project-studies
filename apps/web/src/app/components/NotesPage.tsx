'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  InputAdornment,
  CircularProgress,
  Paper,
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import { NoteCard } from './NoteCard';
import { NoteForm } from './NoteForm';
import { Id, Note } from '@project/shared';



export function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch notes on component mount
  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await fetch('/api/notes', {
        credentials: 'include',
      });

      if (response.ok) {
        const notesData = await response.json();
        setNotes(notesData);
      }
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
      const response = await fetch('/api/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
              console.log('dupa')

        const newNote = await response.json();
        setNotes((prev) => [newNote, ...prev]);
        setIsCreateDialogOpen(false);
      }
    } catch (error) {
      console.log('dupa')
      console.error('Failed to create note:', error);
    }
  };

  const handleUpdateNote = async (
    id: string,
    noteData: { title: string; content: string; tags: string[] }
  ) => {
    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const updatedNote = await response.json();
        setNotes((prev) =>
          prev.map((note) => (note._id === id as unknown as Id ? updatedNote : note))
        );
        setEditingNote(null);
      }
    } catch (error) {
      console.error('Failed to update note:', error);
    }
  };

  const handleDeleteNote = async (id: string) => {
    if (!confirm('Are you sure you want to delete this note?')) return;

    try {
      const response = await fetch(`/api/notes/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note._id !== id as unknown as Id));
      }
    } catch (error) {
      console.error('Failed to delete note:', error);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress size={40} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            My Notes
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {notes.length} notes total
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setIsCreateDialogOpen(true)}
          size="large"
        >
          New Note
        </Button>
      </Box>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Search notes by title, content, or tags..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      {/* Notes Grid */}
      {filteredNotes.length === 0 ? (
        <Paper elevation={1} sx={{ p: 8, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {searchQuery ? 'No notes match your search.' : 'No notes yet.'}
          </Typography>
          {!searchQuery && (
            <Button
              variant="outlined"
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{ mt: 2 }}
            >
              Create your first note
            </Button>
          )}
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {filteredNotes.map((note) => (
            // <Grid item xs={12} sm={6} lg={4} key={note._id}>
              <NoteCard
                note={note}
                onEdit={() => setEditingNote(note)}
                onDelete={() => handleDeleteNote(note._id as unknown as string)}
              />
            // </Grid>
          ))}
        </Grid>
      )}

      {/* Create Dialog */}
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

      {/* Edit Dialog */}
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
              onSubmit={(data) => handleUpdateNote(editingNote._id as unknown as string, data)}
              onCancel={() => setEditingNote(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </Container>
  );
}
