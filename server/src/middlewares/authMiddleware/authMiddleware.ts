import { Request, Response, NextFunction } from 'express'
import { prisma } from '../..'

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // await prisma.user.create({
  //   data: {
  //     email: 'wildudck@email.com',
  //     password: 'wilduckpassowrd',
  //     user_name: 'wildduck'
  //   }
  // })
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    // Validate token
    next()
  } else {
    res.status(401).send({ error: 'Unauthorized' })
  }
}
