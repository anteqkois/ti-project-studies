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
          label="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter note title..."
          required
          fullWidth
          variant="outlined"
        />
        
        <TextField
          label="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your note content here..."
          multiline
          rows={8}
          fullWidth
          variant="outlined"
        />
        
        <TextField
          label="Tags"
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder="Enter tags separated by commas (e.g., work, ideas, personal)"
          fullWidth
          variant="outlined"
          helperText="Separate multiple tags with commas"
        />
        
        <DialogActions sx={{ px: 0, pt: 2 }}>
          <Button onClick={onCancel} color="secondary">
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={!title.trim() || isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
          >
            {initialData ? 'Update Note' : 'Create Note'}
          </Button>
        </DialogActions>
      </Stack>
    </Box>
  )
}