import { Blobs } from '@prisma/client'
import { BlobData, SaveBlob } from '../..'
import { prisma } from '../../..'
import { StorageService } from '../../index.types'
import {
  ListBlobsMetaDataType,
  PaginationType,
  RetrievBlobMetaDataType,
  saveBlobMetaDataType
} from './DatabaseAdapter.types'

export class DBService implements StorageService {
  async saveBlob({
    id,
    name,
    size,
    type,
    data,
    user_id
  }: SaveBlob): Promise<BlobData | null> {
    try {
      const blobData = await prisma.blob.create({
        data: {
          id,
          data: Buffer.from(data, 'base64')
        }
      })
      if (!blobData) return null

      //NOTE: Save metadata to the database
      const blob = await DBService.saveBlobMetaData({
        id,
        user_id,
        type,
        name,
        size: size!,
        blob_url: '',
        blob_id: blobData.id
      })
      if (!blob) return null

      return blob
    } catch (error) {
      return null
    }
  }

  async getBlob({
    id,
    user_id
  }: {
    id: string
    user_id: string
  }): Promise<BlobData | null> {
    try {
      const blobMetaData = await DBService.retrievBlobMetaData({
        id,
        user_id
      })
      if (!blobMetaData) return null

      const blobData = {
        ...blobMetaData
      }
      return blobData
    } catch (error) {
      return null
    }
  }

  static async saveBlobMetaData({
    id,
    user_id,
    blob_url,
    blob_id,
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
          size,
          user_id,
          blob_id,
          blob_url
        }
      })
      if (!blob) return null

      return blob
    } catch (error) {
      return null
    }
  }

  static async retrievBlobMetaData({
    id,
    user_id
  }: RetrievBlobMetaDataType): Promise<
    | ({
        Blob: {
          data: Buffer
        } | null
      } & BlobData)
    | null
  > {
    try {
      const blob = await prisma.blobs.findUnique({
        where: {
          id,
          user_id
        },
        include: {
          Blob: {
            select: {
              data: true
            }
          }
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
      return null
    }
  }
}
