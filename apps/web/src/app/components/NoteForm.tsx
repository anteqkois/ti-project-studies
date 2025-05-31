'use client'

import { useState, useEffect } from 'react'
import {
  Box,
 
  Button,
  TextField,
 
  DialogActions,
 
  CircularProgress,

  Stack,

} from '@mui/material'
import { Note } from '@project/shared'


interface NoteFormProps {
  initialData?: Note
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void
  onCancel: () => void
}

export function NoteForm({ initialData, onSubmit, onCancel }: NoteFormProps) {
  const [title, setTitle] = useState(initialData?.title || '')
  const [content, setContent] = useState(initialData?.content || '')
  const [tagsInput, setTagsInput] = useState(initialData?.tags.join(', ') || '')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const tags = tagsInput
      .split(',')
      .map((tag: string) => tag.trim())
      .filter((tag: string | any[]) => tag.length > 0)
    
    await onSubmit({ title, content, tags })
    setIsSubmitting(false)
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ pt: 2 }}>
      <Stack spacing={3}>
        <TextField
          label="Tytuł"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Wpisz tytuł..."
          required
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0f1419',
              color: '#f1f5f9',
              '& fieldset': { borderColor: '#374151' },
              '&:hover fieldset': { borderColor: '#4b5563' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': { color: '#3b82f6' }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#6b7280',
              opacity: 1,
            },
          }}
        />
        
        <TextField
          label="Zawartość"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Wpisz swoją zawartość..."
          multiline
          rows={8}
          fullWidth
          variant="outlined"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0f1419',
              color: '#f1f5f9',
              '& fieldset': { borderColor: '#374151' },
              '&:hover fieldset': { borderColor: '#4b5563' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': { color: '#3b82f6' }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#6b7280',
              opacity: 1,
            },
          }}
        />
        
        <TextField
          label="Tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Podaj tag lub tagi odzielone [,]"
          fullWidth
          variant="outlined"
          helperText="Różne tagi"
          sx={{
            '& .MuiOutlinedInput-root': {
              backgroundColor: '#0f1419',
              color: '#f1f5f9',
              '& fieldset': { borderColor: '#374151' },
              '&:hover fieldset': { borderColor: '#4b5563' },
              '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
            },
            '& .MuiInputLabel-root': {
              color: '#9ca3af',
              '&.Mui-focused': { color: '#3b82f6' }
            },
            '& .MuiInputBase-input::placeholder': {
              color: '#6b7280',
              opacity: 1,
            },
            '& .MuiFormHelperText-root': {
              color: '#9ca3af'
            }
          }}
        />
        
        <DialogActions sx={{ px: 0, pt: 2 }}>
          <Button 
            onClick={onCancel} 
            sx={{ 
              color: '#9ca3af',
              '&:hover': { backgroundColor: '#374151' }
            }}
          >
            Anuluj
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
            sx={{ 
              backgroundColor: '#872ffa',
              fontWeight: 500,
              border: '1px white solid'
            
            }}
          >
            {initialData ? 'Aktualizuj' : 'Gotowe'}
          </Button>
        </DialogActions>
      </Stack>
    </Box>
  )
}