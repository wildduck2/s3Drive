import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'
import { useForm, SubmitHandler } from 'react-hook-form'
import { LoginFormInputs } from './Signin.types'
import { useSignin } from '@/hooks'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormInputs>()

  const { signin } = useSignin()
  const onSubmit: SubmitHandler<LoginFormInputs> = (data) => {
    console.log(data)
    signin(data)
  }

  return (
    <div className="grid place-content-center min-h-screen w-full">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Enter your email below to login to your account.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-4"
          >
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span className="text-red-600">{errors.email.message}</span>}
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <span className="text-red-600">{errors.password.message}</span>}
            </div>
            <CardFooter>
              <Button
                type="submit"
                className="w-full"
              >
                Sign in
              </Button>
            </CardFooter>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
