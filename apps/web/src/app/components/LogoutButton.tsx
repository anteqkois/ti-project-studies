'use client';

import {
  ButtonClient
} from '@project/ui-components/client';
import { Icons } from '@project/ui-components/server';
import { useCustomer } from '../../modules/customer/useCustomer';

export function LogoutButton() {
  const { logout } = useCustomer();

  return (
    <ButtonClient onClick={() => logout()}>
      Log out
      <Icons.Exit className='ml-2'/>
    </ButtonClient>
  );
}
