import { Blob, Blobs } from '@prisma/client'
import { SaveBlob } from '../..'
import { prisma } from '../../..'
import { StorageService } from '../../index.types'
import { uuidv7 } from 'uuidv7'
import {
  ListBlobsMetaDataType,
  PaginationType,
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
    console.log(user_id)

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

  static async listBlobsMetaData({
    page,
    pageSize
  }: ListBlobsMetaDataType): Promise<{
    blobs: Blobs[]
    pagination: PaginationType
  } | null> {
    try {
      const skip = (+page - 1) * +pageSize
      const blobs = await prisma.blobs.findMany({
        skip: skip,
        take: +pageSize,
        orderBy: {
          createdAt: 'desc'
        }
      })

      const totalCount = await prisma.blobs.count()
      const totalPages = Math.ceil(totalCount / +pageSize)

      return {
        blobs,
        pagination: {
          page: +page,
          nextPage: +page < +totalPages ? +page + 1 : null,
          prevPage: +page > 1 ? +page - 1 : null,
          pageSize: +pageSize,
          totalCount,
          totalPages: Math.ceil(totalCount / +pageSize)
        }
      }
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
