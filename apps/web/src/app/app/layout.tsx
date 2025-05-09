import { AuthGuard } from '../../modules/customer/AuthGuard';
import { CustomerProvider } from '../../modules/customer/useCustomer';

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <CustomerProvider>
        <AuthGuard />
        {children}
      </CustomerProvider>
    </div>
  );
}
