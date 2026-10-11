import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

import { Button } from '@/components/ui/button'

import AuthLayout from '../components/AuthLayout'
import { ForgotPasswordForm } from '../components/ForgotPasswordForm'
import type { ForgotPasswordResponse } from '../types/auth.types'

const backToSignIn = (
  <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
    <ArrowLeft className="size-3.5" aria-hidden="true" />
    Back to sign in
  </Link>
)

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState<ForgotPasswordResponse | null>(null)

  if (sent) {
    return (
      <AuthLayout title="Check your email" description={sent.message} footer={backToSignIn}>
        <div className="flex flex-col gap-4">
          {import.meta.env.DEV && sent.devResetLink && <DevResetLink link={sent.devResetLink} />}
          <Button variant="outline" size="lg" onClick={() => setSent(null)}>
            Use a different email
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout
      title="Reset your password"
      description="Enter your account email and we'll send a reset link."
      footer={backToSignIn}
    >
      <ForgotPasswordForm onSent={setSent} />
    </AuthLayout>
  )
}

interface DevResetLinkProps {
  link: string
}

/** No email is sent by this API; in development the link comes back in the response. */
function DevResetLink({ link }: DevResetLinkProps) {
  const url = new URL(link, window.location.origin)

  return (
    <div className="rounded-lg border border-dashed border-amber-400 bg-amber-50 p-3 text-sm text-amber-950">
      <p className="font-medium">Dev only: no email is sent.</p>
      <Link to={url.pathname + url.search} className="font-medium text-primary underline">
        Open the reset link
      </Link>
    </div>
  )
}
