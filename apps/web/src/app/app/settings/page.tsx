'use client';

import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from 'apps/web/src/libs/api-client';
import { useCustomer } from 'apps/web/src/modules/customer/useCustomer';

interface Customer {
  _id: string;
  email: string;
  createdAt: string;
}

export default function SettingsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [date, setDate] = useState();

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const router = useRouter();
  const { logout } = useCustomer();

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const { data } = await apiClient.get('/customers/me');
      setCustomer(data);
      setEmail(data.email || '');

      setDate(data.created_at)
    } catch (error) {
      setMessage({ type: 'error', text: 'Nie udało się załadować profilu' });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const { data } = await apiClient.put('/customers/me/settings', {
        name: name.trim() || undefined,
        email: email.trim(),
      });
      
      setCustomer(data);
      setMessage({ type: 'success', text: 'Profil zaktualizowany pomyślnie.' });
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
      logout()
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Nowe hasła nie pasują' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Hasło musi być <6' });
      return;
    }

    setSaving(true);
    setMessage(null);
    
    try {
      await apiClient.put('/customers/me/password', {
        currentPassword,
        newPassword,
      });
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setMessage({ type: 'success', text: 'Hasło zmienione pomyślnie' });
    } catch (error: any) {
      console.error('Failed to change password:', error);
      const errorMessage = error.response?.data?.error || 'Failed to change password. Check your current password.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      return;
    }
    
    setSaving(true);
    setMessage(null);
    
    try {
      await apiClient.delete('/customers/delete');
      router.push('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
      setMessage({ type: 'error', text: 'Failed to delete account' });
      setSaving(false);
    }
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
        backgroundColor: '#1e2328'
      }}>
      </Box>
    );
  }
  console.log(customer?.createdAt)
  return (
    <Box sx={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#1e2328',
      color: '#f1f5f9'
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: '#6c28d9',
        borderBottom: '1px solid #374151',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexShrink: 0
      }}>
        <IconButton 
          onClick={() => router.back()}
          sx={{ color: 'white' }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
          Ustawienia
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ 
        flex: 1,
        overflow: 'auto',
        p: 3,
        paddingLeft: "25%",
        paddingRight: "25%",
        mx: 'auto',
        width: '100%',
        backgroundColor: '#030712'
      }}>
        {message && (
          <Alert 
            severity={message.type} 
            sx={{ 
              mb: 3,
              backgroundColor: message.type === 'success' ? '#1e3a8a' : '#7f1d1d',
              color: '#f1f5f9'
            }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {/* Profile Settings */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: '#1e2328',
          border: '1px solid #374151'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f1f5f9' }}>
              Informacje o profilu
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                variant="outlined"
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    '& fieldset': { borderColor: '#374151' },
                    '&:hover fieldset': { borderColor: '#4b5563' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                disabled={saving || !email.trim()}

                sx={{ 
                    backgroundColor: '#872ffa',
                     border: '1px white solid',
                  alignSelf: 'flex-start',
                  '&:hover': { backgroundColor: '#2563eb' },
                  fontWeight: 500,
                  color: 'white'
                }}
              >
                {saving ? 'Zapisywanie...' : 'Zaktualizowano'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: '#1e2328',
          border: '1px solid #374151'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f1f5f9' }}>
              Zmiana hasła
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Obecne hasło"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    '& fieldset': { borderColor: '#374151' },
                    '&:hover fieldset': { borderColor: '#4b5563' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              
              <TextField
                label="Nowe hasło"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                variant="outlined"
                helperText="Hasło musi mieć >6"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    '& fieldset': { borderColor: '#374151' },
                    '&:hover fieldset': { borderColor: '#4b5563' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                  '& .MuiFormHelperText-root': {
                    color: '#9ca3af',
                  },
                }}
              />
              
              <TextField
                label="Potwierdź nowe hasło"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                variant="outlined"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#f1f5f9',
                    '& fieldset': { borderColor: '#374151' },
                    '&:hover fieldset': { borderColor: '#4b5563' },
                    '&.Mui-focused fieldset': { borderColor: '#3b82f6' },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#9ca3af',
                  },
                  '& .MuiInputLabel-root.Mui-focused': {
                    color: '#3b82f6',
                  },
                }}
              />
              
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                sx={{ 
                  alignSelf: 'flex-start',
                  '&:hover': { backgroundColor: '#2563eb' },
                    backgroundColor: '#872ffa',
                  fontWeight: 500,
                
                }}
              >
                {saving ? 'Zmiana...' : 'Hasło zmienione'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card sx={{ 
          mb: 3,
          backgroundColor: '#1e2328',
          border: '1px solid #374151'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#f1f5f9' }}>
              Szczegóły konta
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                <strong>Account ID:</strong> {customer?._id}
              </Typography>
              <Typography variant="body2" sx={{ color: '#9ca3af' }}>
                <strong>Członek od:</strong> {date}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ 
          border: '1px solid #ef4444',
          backgroundColor: '#1e2328'
        }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ef4444' }}>
Uwaga            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, color: '#9ca3af' }}>
              Raz skasowane konto nie może być przywrócone. Bądź ostrożny.
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
              disabled={saving}
              sx={{ 
                borderColor: '#ef4444',
                color: '#ef4444',
                '&:hover': {
                  borderColor: '#dc2626',
                  backgroundColor: '#7f1d1d'
                }
              }}
            >
              {saving ? 'Usuwanie...' : 'Konto usunięte'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}