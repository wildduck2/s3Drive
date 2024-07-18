import { Request, Response, NextFunction } from 'express'

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7, authHeader.length)
    // Validate token
    next()
  } else {
    res.status(401).send({ error: 'Unauthorized' })
  }
}
