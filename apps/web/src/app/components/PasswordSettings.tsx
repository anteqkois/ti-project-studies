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
    <Card sx={{
      backgroundColor: '#1e2328',
      border: '1px solid #374151',
      '&:hover': {
        borderColor: '#4b5563',
      }
    }}>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <LockIcon sx={{ color: '#9ca3af' }} />
            <Typography variant="h6" sx={{ color: '#f1f5f9' }}>
              Password & Security
            </Typography>
          </Box>
        }
        action={
          !isChanging && (
            <Button
              variant="outlined"
              size="small"
              onClick={() => setIsChanging(true)}
              sx={{
                borderColor: '#374151',
                color: '#9ca3af',
                '&:hover': {
                  borderColor: '#4b5563',
                  backgroundColor: '#374151'
                }
              }}
            >
              Change Password
            </Button>
          )
        }
        sx={{
          borderBottom: '1px solid #374151'
        }}
      />

      <CardContent>
        {message && (
          <Alert
            severity={message.type === 'error' ? 'error' : 'success'}
            sx={{ 
              mb: 2,
              backgroundColor: message.type === 'error' ? '#7f1d1d' : '#064e3b',
              borderColor: message.type === 'error' ? '#991b1b' : '#047857',
              color: message.type === 'error' ? '#fecaca' : '#a7f3d0',
              '& .MuiAlert-icon': {
                color: message.type === 'error' ? '#f87171' : '#10b981'
              }
            }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {!isChanging ? (
          <Box sx={{ color: '#9ca3af', fontSize: '0.875rem' }}>
            <Typography variant="body2" sx={{ mb: 1, color: '#d1d5db' }}>
              Your password was last updated recently.
            </Typography>
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
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
              fullWidth
              type="password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              placeholder="Enter your new password"
              helperText="Must be at least 8 characters with uppercase, lowercase, and special characters"
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

            <TextField
              fullWidth
              type="password"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your new password"
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

            <Divider sx={{ my: 1, borderColor: '#374151' }} />

            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSubmitting}
                sx={{
                  borderColor: '#374151',
                  color: '#9ca3af',
                  '&:hover': {
                    borderColor: '#4b5563',
                    backgroundColor: '#374151'
                  },
                  '&:disabled': {
                    borderColor: '#374151',
                    color: '#6b7280'
                  }
                }}
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
                startIcon={isSubmitting ? <CircularProgress size={16} sx={{ color: 'white' }} /> : null}
                sx={{
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  '&:disabled': { 
                    backgroundColor: '#374151',
                    color: '#6b7280'
                  }
                }}
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