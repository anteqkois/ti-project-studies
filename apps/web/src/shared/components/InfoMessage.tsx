'use client'
import { Icons } from '@project/ui-components/server'
import { cn } from '@project/ui-components/utils'
import { HTMLAttributes } from 'react'

export type InfoMessageProps = HTMLAttributes<HTMLElement>

export const InfoMessage = ({ children, className }: InfoMessageProps) => {
  return (
    <div className={cn('p-2 text-accent-foreground bg-accent border-2 rounded-md', className)}>
      <div className="flex items-center gap-2 font-bold">
        <Icons.Info />
        Information
      </div>
      {children}
    </div>
  )
}
