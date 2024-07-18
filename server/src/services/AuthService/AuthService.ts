import jwt from 'jsonwebtoken'

export class AuthService {
  secret: string
  constructor(secret: string) {
    this.secret = secret
  }

  generateToken(payload: string) {
    return jwt.sign(payload, this.secret)
  }

  verifyToken(token: string) {
    return jwt.verify(token, this.secret)
  }
}
