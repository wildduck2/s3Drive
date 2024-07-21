import { LoginFormInputs } from '@/components/layout'
import { useNavigate } from '@tanstack/react-router'
import axios from 'axios'

export const useSignin = () => {
  const router = useNavigate()
  const signin = async (data: LoginFormInputs) => {
    try {
      const { data: token } = await axios.post(
        `${process.env.ROOT_URL}/auth/singin`,
        {
          ...data,
        },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
          },
        },
      )
      if (!token) return null

      localStorage.setItem('token', JSON.stringify(token.token))
      router({ to: '/' })

      return token
    } catch (error) {
      return null
    }
  }

  return { signin }
}
