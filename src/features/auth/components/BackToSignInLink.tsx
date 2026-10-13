import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router'

export function BackToSignInLink() {
  return (
    <Link to="/login" className="inline-flex items-center gap-1 font-medium text-primary hover:underline">
      <ArrowLeft className="size-3.5" aria-hidden="true" />
      Back to sign in
    </Link>
  )
}
