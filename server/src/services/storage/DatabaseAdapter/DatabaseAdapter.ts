import { Blob } from '@prisma/client'
import { SaveBlob } from '../..'
import { prisma } from '../../..'
import { StorageService } from '../../index.types'

export class DBService implements StorageService {
  async saveBlob({ id, name, size, data }: SaveBlob): Promise<Blob | null> {
    // console.log(id)

    try {
      const blob = await prisma.blob.create({
        data: {
          id,
          size: size!,
          data
        }
      })

      console.log(blob)

      if (!blob) return null

      return blob
    } catch (error) {
      return null
    }
  }

  async getBlob(id: string): Promise<Buffer> {
    // Implement DB retrieval logic
  }
}
