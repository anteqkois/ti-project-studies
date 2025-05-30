// PasswordSettings.tsx - Password change component
import { Lock as LockIcon } from '@mui/icons-material';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  TextField,
  Typography,
} from '@mui/material';
import { useState } from 'react';

export function PasswordSettings() {
  const [isChanging, setIsChanging] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return minLength && hasUpper && hasLower && hasSpecial;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    if (!validatePassword(newPassword)) {
      setMessage({
        type: 'error',
        text: 'Password must be at least 8 characters with uppercase, lowercase, and special characters',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/customers/me/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setIsChanging(false);

        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.error || 'Failed to update password',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsChanging(false);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setMessage(null);
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <LockIcon color="action" />
            <Typography variant="h6">Password & Security</Typography>
          </Box>
        }
        action={
          !isChanging && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsChanging(true)}
            >
              Change Password
            </Button>
          )
        }
      />

      <CardContent>
        {message && (
          <Alert
            severity={message.type === 'error' ? 'error' : 'success'}
            sx={{ mb: 2 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {!isChanging ? (
          <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Your password was last updated recently.
            </Typography>
            <Typography variant="body2">
              We recommend using a strong, unique password for your account.
            </Typography>
          </Box>
        ) : (
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              fullWidth
              type="password"
              label="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              placeholder="Enter your current password"
            />

            <TextField
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              helperText="Must be at least 8 characters with uppercase, lowercase, and special characters"
            />

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
            />

            <Divider sx={{ my: 1 }} />

            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  !currentPassword ||
                  !newPassword ||
                  !confirmPassword ||
                  isSubmitting
                }
                startIcon={isSubmitting ? <CircularProgress size={16} /> : null}
              >
                Update Password
              </Button>
            </Box>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
