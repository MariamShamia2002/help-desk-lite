import { Link } from 'react-router'

import AuthLayout from '../components/AuthLayout'
import { SignupForm } from '../components/SignupForm'

export default function SignupPage() {
  return (
    <AuthLayout
      title="Create your account"
      description="File tickets and follow every reply in one place."
      wide
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <SignupForm />
    </AuthLayout>
  )
}
