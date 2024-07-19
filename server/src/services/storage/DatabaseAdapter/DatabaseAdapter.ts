import { Blob } from '@prisma/client'
import { SaveBlob } from '../..'
import { prisma } from '../../..'
import { StorageService } from '../../index.types'
import { uuidv7 } from 'uuidv7'
import {
  RetrievBlobMetaDataType,
  saveBlobMetaDataType
} from './DatabaseAdapter.types'

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

  static async saveBlobMetaData({
    id,
    user_id,
    blob_url,
    size,
    name,
    type
  }: saveBlobMetaDataType) {
    try {
      const blob = await prisma.blobs.create({
        data: {
          id,
          name,
          type,
          user_id,
          size,
          blob_url
        }
      })
      if (!blob) return null

      return blob
    } catch (error) {
      console.log(error)

      return null
    }
  }

  static async retrievBlobMetaData({ id, user_id }: RetrievBlobMetaDataType) {
    try {
      const blob = await prisma.blobs.findUnique({
        where: {
          id,
          user_id
        }
      })
      if (!blob) return null

      return blob
    } catch (error) {
      return null
    }
  }
}
