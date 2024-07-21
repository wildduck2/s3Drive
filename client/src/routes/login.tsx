import { LoginForm } from '@/components/layout/Signin/Signin'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: () => <LoginForm />,
})
