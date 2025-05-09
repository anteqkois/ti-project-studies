'use client';
import {
  AuthStatus,
  Cookies,
  Customer,
  IAuthLogoutResponse,
  LoginInput,
  SignUpInput,
  SignUpResponse,
  assertNotNullOrUndefined,
} from '@project/shared';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import { useCookie } from '../../shared/hooks/useCookie';
import { useLocalStorage } from '../../shared/hooks/useLocalStorage';
import { AuthApi } from './api';

type ReturnType = {
  authStatus: AuthStatus;
  setAuthStatus: Dispatch<SetStateAction<AuthStatus>>;
  customer: Customer;
  setCustomer: Dispatch<SetStateAction<Customer>>;
  signUp: (data: SignUpInput) => Promise<SignUpResponse>;
  login: (data: LoginInput) => Promise<void>;
  logout: (data?: {
    withRedirect?: boolean;
    redirect?: string;
  }) => Promise<IAuthLogoutResponse>;
  /* emial verification */
  emialVerificationDialog: boolean;
  setEmailVerificationDialog: Dispatch<SetStateAction<boolean>>;
};

const Context = createContext<ReturnType>({} as ReturnType);

export function CustomerProvider({ children }: PropsWithChildren) {
  const [authStatus, setAuthStatus] = useCookie<AuthStatus>(
    Cookies.AUTH_STATUS,
    AuthStatus.LOADING
  );
  const [customer, setCustomer] = useLocalStorage(
    'customer-data',
    {} as Customer
  );
  const [emialVerificationDialog, setEmailVerificationDialog] =
    useState<boolean>(false);
  const { push } = useRouter();
  const searchParams = useSearchParams();

  const signUp = useCallback(async (data: SignUpInput) => {
    const response = await AuthApi.signUp(data);

    setCustomer(response.data.customer);
    setAuthStatus(AuthStatus.AUTHENTICATED);
    return response.data;
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const { data } = await AuthApi.login({
      email: input.email,
      password: input.password,
    });

    setCustomer(data.customer);
    setAuthStatus(AuthStatus.AUTHENTICATED);

    if (!data.customer.email_verified_datetime) {
      return push('/app/dashboard');
    }

    const from = searchParams.get('from');
    if (from) return push(from);

    return push('/app/dashboard');
  }, []);

  const logout = useCallback(
    async (data?: { withRedirect?: boolean; redirect?: string }) => {
      if (typeof data?.withRedirect !== 'boolean')
        data = { ...data, withRedirect: true };
      if (typeof data?.redirect !== 'string') data = { ...data, redirect: '/' };

      assertNotNullOrUndefined(data.redirect, 'data.redirect');
      assertNotNullOrUndefined(data.withRedirect, 'data.withRedirect');

      // const { withRedirect, redirect } = data
      const response = await AuthApi.logout();

      setCustomer({} as Customer);
      setAuthStatus(AuthStatus.UNAUTHENTICATED);
      // if(response.data.error) // TODO handle error

      if (data.withRedirect) push(data.redirect);

      return response.data;
    },
    []
  );

  return (
    <Context.Provider
      value={{
        authStatus,
        setAuthStatus,
        customer,
        setCustomer,
        signUp,
        login,
        logout,
        emialVerificationDialog,
        setEmailVerificationDialog,
      }}
    >
      {children}
    </Context.Provider>
  );
}

export function useCustomer() {
  const context = useContext(Context);
  if (!context) {
    throw new Error('useCustomer must be used within a CustomerProvider');
  }
  return context;
}
