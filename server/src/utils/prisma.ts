import { PrismaClient } from '../../prisma/generated/client'

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  // @ts-expect-error prisma
  if (!global.prisma) {
    // @ts-expect-error prisma
    global.prisma = new PrismaClient()
  }
  // @ts-expect-error prisma
  prisma = global.prisma
}

export { prisma }
