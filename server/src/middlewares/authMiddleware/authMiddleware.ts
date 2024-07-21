import { Request, Response, NextFunction } from 'express'
import { prisma } from '../..'
import { AuthService } from '../../services'
import { config } from '../../config'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    AuthService.verifyToken(token, config.jwtSecret)
    next()
  } else {
    res.status(401).send({ error: 'Unauthorized' })
  }
}
