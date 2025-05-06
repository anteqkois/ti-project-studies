'use client'
import { Icons } from '@project/ui-components/server'
import { cn } from '@project/ui-components/utils'
import { HTMLAttributes } from 'react'

export type WarningInfoProps = HTMLAttributes<HTMLElement>

export const WarningInfo = ({ children, className }: WarningInfoProps) => {
  return (
    <div className={cn('p-2 text-warning bg-warning-foreground border-2 rounded-md border-warning/50 border-dashed', className)}>
      <div className="flex items-center gap-2 font-bold">
        <Icons.Warn />
        Warning!
      </div>
      {children}
    </div>
  )
}
