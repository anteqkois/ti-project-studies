import { CustomerProvider } from '../../modules/customer/useCustomer'

interface AuthLayoutProps {
  children: React.ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen">
      <CustomerProvider>{children}</CustomerProvider>
    </div>
  )
}
