import jwt from 'jsonwebtoken'
import { prisma } from '../..'

export class AuthService {
  static generateToken(
    payload: { user_id: string; email: string },
    jwtSecret: string
  ) {
    try {
      return jwt.sign(payload, jwtSecret, { expiresIn: '1h' })
    } catch (error) {
      throw new Error('Error generating token')
    }
  }

  static verifyToken(token: string, jwtSecret: string) {
    return jwt.verify(token, jwtSecret)
  }

  static async signIn({
    jwtSecret,
    email,
    password
  }: {
    jwtSecret: string
    email: string
    password: string
  }): Promise<string | null> {
    try {
      const user = await prisma.user.findUnique({
        where: { email }
      })
      if (!user) return null

      const isPasswordValid = user.password === password // await bcrypt.compare(password, user.password)
      if (!isPasswordValid) return null

      console.log('hi')
      const token = this.generateToken(
        { user_id: user.id, email: user.email },
        jwtSecret
      )

      return token
    } catch (error) {
      console.log(error)
      return null
    }
  }
}
