// DangerZone.tsx - Account deletion component
import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Alert,
  AlertTitle,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Warning as WarningIcon,
} from '@mui/icons-material';

interface DangerZoneProps {
  onAccountDeleted: () => void;
}

export function DangerZone({ onAccountDeleted }: DangerZoneProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch('/customers/me', {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        onAccountDeleted();
      } else {
        console.error('Failed to delete account');
      }
    } catch (error) {
      console.error('Error deleting account:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card sx={{ borderColor: 'error.main', borderWidth: 1 }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <WarningIcon color="error" />
            <Typography variant="h6" color="error">
              Danger Zone
            </Typography>
          </Box>
        }
      />

      <CardContent>
        <Paper
          sx={{
            p: 2,
            bgcolor: 'error.light',
            borderColor: 'error.main',
            borderWidth: 1,
          }}
        >
          <Typography variant="h6" color="error.dark" sx={{ mb: 1 }}>
            Delete Account
          </Typography>
          <Typography variant="body2" color="error.dark" sx={{ mb: 2 }}>
            Once you delete your account, there is no going back. This will
            permanently delete your account, all your notes, and remove all
            associated data.
          </Typography>

          <Button
            variant="contained"
            color="error"
            size="small"
            startIcon={<DeleteIcon />}
            onClick={() => setIsDialogOpen(true)}
          >
            Delete Account
          </Button>
        </Paper>

        <Dialog
          open={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle sx={{ color: 'error.main' }}>Delete Account</DialogTitle>

          <DialogContent>
            <Alert severity="error" icon={<WarningIcon />} sx={{ mb: 2 }}>
              <AlertTitle>This action cannot be undone.</AlertTitle>
              This will permanently delete your account and all associated data
              including all your notes.
            </Alert>

            <TextField
              fullWidth
              label="Type DELETE MY ACCOUNT to confirm"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE MY ACCOUNT"
              sx={{ fontFamily: 'monospace', mt: 2 }}
              helperText="Type exactly: DELETE MY ACCOUNT"
            />
          </DialogContent>

          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => {
                setIsDialogOpen(false);
                setConfirmText('');
              }}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleDeleteAccount}
              disabled={confirmText !== 'DELETE MY ACCOUNT' || isDeleting}
              startIcon={
                isDeleting ? <CircularProgress size={16} /> : <DeleteIcon />
              }
            >
              Delete Account
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
