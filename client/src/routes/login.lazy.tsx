import { LoginForm } from '@/components/layout/Signin/Signin'
import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/login')({
  component: () => <LoginForm />,
})
