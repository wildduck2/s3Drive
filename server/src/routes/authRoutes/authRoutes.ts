import { Router } from 'express'
import { AuthController } from '../../controllers'

const router = Router()

router.post('/auth/singin', (req, res) => {
  AuthController.signIn(req, res)
})

export { router as authRouter }
