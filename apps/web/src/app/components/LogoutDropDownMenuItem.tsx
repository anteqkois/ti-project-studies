'use client'

import { DropdownMenuItem, DropdownMenuShortcut } from "@project/ui-components/client"
import { Icons } from "@project/ui-components/server"
import { useCustomer } from "../../modules/customer/useCustomer"

export function LogoutDropDownMenuItem() {
  const { logout } = useCustomer()

  return (
    <DropdownMenuItem onClick={() => logout()}>
      Log out
      <DropdownMenuShortcut>
        <Icons.Exit />
      </DropdownMenuShortcut>
    </DropdownMenuItem>
  )
}
