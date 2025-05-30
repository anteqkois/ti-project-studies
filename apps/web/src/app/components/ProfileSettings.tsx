// ProfileSettings.tsx - Profile information component
import { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardHeader,
  TextField,
  Button,
  Alert,
  Grid,
  Divider,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  Person as PersonIcon,
  Save as SaveIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { Customer } from '@project/shared';

interface ProfileSettingsProps {
  customer: Customer;
  onUpdate: (customer: Customer) => void;
}

export function ProfileSettings({ customer, onUpdate }: ProfileSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(customer.name);
  const [email, setEmail] = useState(customer.email);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/customers/me/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
        }),
      });

      if (response.ok) {
        const updatedCustomer = await response.json();
        onUpdate(updatedCustomer);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });

        // Clear success message after 3 seconds
        setTimeout(() => setMessage(null), 3000);
      } else {
        const errorData = await response.json();
        setMessage({
          type: 'error',
          text: errorData.error || 'Failed to update profile',
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(customer.name);
    setEmail(customer.email);
    setIsEditing(false);
    setMessage(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card>
      <CardHeader
        title={
          <Box display="flex" alignItems="center" gap={1}>
            <PersonIcon color="action" />
            <Typography variant="h6">Profile Information</Typography>
          </Box>
        }
        action={
          !isEditing && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<EditIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit
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

        <Grid container spacing={2} sx={{ mb: 3 }}>
          
            <TextField
              fullWidth
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!isEditing}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
         
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={!isEditing}
              InputProps={{
                readOnly: !isEditing,
              }}
            />
            {!customer.email_verified_datetime && (
              <Chip
                label="Email not verified"
                color="warning"
                size="small"
                sx={{ mt: 1 }}
              />
            )}
          
        </Grid>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>
          <Typography variant="body2" sx={{ mb: 1 }}>
            <strong>Account created:</strong> {formatDate(customer.created_at as unknown as string)}
          </Typography>
          {customer.email_verified_datetime && (
            <Typography variant="body2">
              <strong>Email verified:</strong>{' '}
              {formatDate(customer.email_verified_datetime as unknown as string)}
            </Typography>
          )}
        </Box>

        {isEditing && (
          <>
            <Divider sx={{ my: 2 }} />
            <Box display="flex" justifyContent="flex-end" gap={1}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={!name.trim() || !email.trim() || isSaving}
                startIcon={
                  isSaving ? <CircularProgress size={16} /> : <SaveIcon />
                }
              >
                Save Changes
              </Button>
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}
