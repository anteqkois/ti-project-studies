'use client';

import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as TagIcon,
  CalendarToday as CalendarIcon,
} from '@mui/icons-material';
import { Note } from '@project/shared';

interface NoteCardProps {
  note: Note;
  onEdit: () => void;
  onDelete: () => void;
}

export function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <Card
      elevation={2}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.2s ease-in-out',
        backgroundColor: '#1e2328',
        border: '1px solid #374151',
        '&:hover': {
          elevation: 8,
          transform: 'translateY(-2px)',
          borderColor: '#4b5563',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={2}
        >
          <Typography
            variant="h6"
            component="h3"
            sx={{
              fontWeight: 600,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flexGrow: 1,
              mr: 1,
              color: '#f1f5f9'
            }}
          >
            {note.title || 'Untitled'}
          </Typography>
          <Box>
            <IconButton 
              size="small" 
              onClick={onEdit} 
              sx={{ 
                color: '#60a5fa',
                '&:hover': { backgroundColor: '#374151' }
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton 
              size="small" 
              onClick={onDelete} 
              sx={{ 
                color: '#f87171',
                '&:hover': { backgroundColor: '#374151' }
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>

        {note.content && (
          <Typography
            variant="body2"
            sx={{
              mb: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              color: '#d1d5db'
            }}
          >
            {note.content}
          </Typography>
        )}

        {note.tags.length > 0 && (
          <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
            {note.tags.slice(0, 3).map((tag) => (
              <Chip
                key={tag}
                label={tag}
                size="small"
                icon={<TagIcon sx={{ color: '#9ca3af' }} />}
                variant="outlined"
                sx={{ 
                  mb: 1,
                  backgroundColor: '#374151',
                  borderColor: '#4b5563',
                  color: '#e5e7eb',
                  '& .MuiChip-icon': {
                    color: '#9ca3af'
                  }
                }}
              />
            ))}
            {note.tags.length > 3 && (
              <Chip
                label={`+${note.tags.length - 3}`}
                size="small"
                variant="filled"
                sx={{ 
                  mb: 1,
                  backgroundColor: '#4b5563',
                  color: '#e5e7eb'
                }}
              />
            )}
          </Stack>
        )}
      </CardContent>

      <CardActions sx={{ pt: 0, borderTop: 1, borderColor: '#374151' }}>
        <Box display="flex" alignItems="center" sx={{ color: '#9ca3af' }}>
          <CalendarIcon sx={{ fontSize: 16, mr: 0.5 }} />
          <Typography variant="caption">
            Updated {formatDate(note.updated_at as unknown as string)}
          </Typography>
        </Box>
      </CardActions>
    </Card>
  );
}