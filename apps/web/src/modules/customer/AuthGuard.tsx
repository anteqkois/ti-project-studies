'use client'

import { AuthStatus } from '@project/shared'
import { useRouter } from 'next/navigation'
import { HTMLAttributes, useEffect } from 'react'
import { useCustomer } from './useCustomer'

export type AuthGuardProps = HTMLAttributes<HTMLElement>

export const AuthGuard = () => {
  const { authStatus } = useCustomer()
  const { push } = useRouter()

  useEffect(() => {
    if (authStatus === AuthStatus.UNAUTHENTICATED) {
      console.warn('customer unauthenticated')
      push('/login')
    }
  }, [])

  return <></>
}
