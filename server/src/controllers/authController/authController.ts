import { Request, Response } from 'express'
import { AuthService } from '../../services'
import { config } from '../../config'

export class AuthController {
  private jwtSecret: string

  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  static async signIn(req: Request, res: Response) {
    const { email, password } = req.body

    try {
      const token = await AuthService.signIn({
        jwtSecret: config.jwtSecret,
        password,
        email
      })
      if (!token)
        return res.status(401).json({ message: 'Invalid email or password' })

      return res.status(200).json({ token })
    } catch (error) {
      console.error('Error signing in:', error)
      res.status(500).json({ message: 'Internal server error' })
    }
  }
}
