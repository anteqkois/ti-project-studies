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
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      setMessage({ type: 'error', text: 'Failed to load profile' });
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
      setMessage({ type: 'success', text: 'Profile updated successfully' });
    } catch (error: any) {
      console.error('Failed to update settings:', error);
      const errorMessage = error.response?.data?.error || 'Failed to update profile';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
      logout()
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }
    
    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
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
      setMessage({ type: 'success', text: 'Password changed successfully' });
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
        backgroundColor: '#f8fafc'
      }}>
        <Typography>Loading...</Typography>
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
      backgroundColor: '#f8fafc',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <Box sx={{ 
        backgroundColor: 'white',
        borderBottom: '1px solid #e2e8f0',
        p: 2,
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        flexShrink: 0
      }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 600, color: '#1e293b' }}>
          Settings
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
        width: '100%'
      }}>
        {message && (
          <Alert 
            severity={message.type} 
            sx={{ mb: 3 }}
            onClose={() => setMessage(null)}
          >
            {message.text}
          </Alert>
        )}

        {/* Profile Settings */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Profile Information
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
              />
              
              <Button
                variant="contained"
                onClick={handleUpdateProfile}
                disabled={saving || !email.trim()}
                sx={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  textTransform: 'none'
                }}
              >
                {saving ? 'Saving...' : 'Update Profile'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Change Password */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Change Password
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Current Password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                fullWidth
                variant="outlined"
              />
              
              <TextField
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                fullWidth
                variant="outlined"
                helperText="Password must be at least 6 characters"
              />
              
              <TextField
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                fullWidth
                variant="outlined"
              />
              
              <Button
                variant="contained"
                onClick={handleChangePassword}
                disabled={saving || !currentPassword || !newPassword || !confirmPassword}
                sx={{ 
                  alignSelf: 'flex-start',
                  backgroundColor: '#3b82f6',
                  '&:hover': { backgroundColor: '#2563eb' },
                  textTransform: 'none'
                }}
              >
                {saving ? 'Changing...' : 'Change Password'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Account Information
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                <strong>Account ID:</strong> {customer?._id}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Member since:</strong> {customer?.createdAt ? new Date(customer.createdAt).toLocaleDateString() : 'N/A'}
              </Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card sx={{ border: '1px solid #ef4444' }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, color: '#ef4444' }}>
              Danger Zone
            </Typography>
            
            <Typography variant="body2" sx={{ mb: 2, color: '#64748b' }}>
              Once you delete your account, there is no going back. Please be certain.
            </Typography>
            
            <Button
              variant="outlined"
              color="error"
              onClick={handleDeleteAccount}
              disabled={saving}
              sx={{ textTransform: 'none' }}
            >
              {saving ? 'Deleting...' : 'Delete Account'}
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}