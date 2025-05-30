// SettingsPage.tsx - Main settings page with Material-UI
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Alert,
  AlertTitle,
  CircularProgress,
  Container,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { useCustomer } from '../../modules/customer/useCustomer';
import { useRouter } from 'next/navigation';
import { ProfileSettings } from './ProfileSettings';
import { PasswordSettings } from './PasswordSettings';
import { DangerZone } from './DangerZone';
import { Customer, CustomerRole } from '@project/shared';



export function SettingsPage() {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const { logout } = useCustomer();
  const router = useRouter();

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      const response = await fetch('/api/customers/me', {
        credentials: 'include',
      });
      if (response.ok) {
        const customerData = await response.json();
        setCustomer(customerData);
      }
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="16rem"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!customer) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Alert severity="error" icon={<WarningIcon />}>
          <AlertTitle>Error</AlertTitle>
          Failed to load account information. Please try refreshing the page.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Box sx={{ mb: 4, pb: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h3" component="h1" fontWeight="bold" gutterBottom>
          Account Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account preferences and security
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Profile Settings */}
        <ProfileSettings
          customer={customer}
          onUpdate={(updatedCustomer) => setCustomer(updatedCustomer as unknown as Customer)}
        />

        {/* Password Settings */}
        <PasswordSettings />

        {/* Danger Zone */}
        <DangerZone
          onAccountDeleted={() => {
            logout();
            router.push('/login');
          }}
        />
      </Box>
    </Container>
  );
}
