import { Index } from '@/components/pages'
import { createFileRoute, useNavigate } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: () => {
    const token = JSON.parse(localStorage.getItem('token'))
    const router = useNavigate()

    if (token) {
      return <Index />
    }

    router({ to: '/login' })
    return 'not authiraized'
  },
})
