import type { ReactNode } from 'react'

import { Logo } from '@/components/shared/Logo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface AuthLayoutProps {
  title: string
  description?: ReactNode
  /** Shown above the card (e.g. why the user was signed out). */
  notice?: ReactNode
  /** Shown below the card (e.g. "New here? Create an account"). */
  footer?: ReactNode
  wide?: boolean
  children: ReactNode
}

export default function AuthLayout({ title, description, notice, footer, wide = false, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-svh flex-col items-center bg-background px-4 py-12">
      <Logo />

      <div className={cn('mt-8 flex w-full flex-col gap-4', wide ? 'max-w-md' : 'max-w-sm')}>
        {notice}

        <Card>
          <CardHeader>
            <CardTitle>
              <h1 className="font-heading text-xl font-semibold">{title}</h1>
            </CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>

        {footer && <div className="text-center text-sm text-muted-foreground">{footer}</div>}
      </div>
    </main>
  )
}
