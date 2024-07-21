import axios from 'axios'
import { BlobData, DBService, SaveBlob, StorageService } from '../..'
import { S3 } from '../../../utils/s3'
import { supportedFileTypes } from '../../../constants'
import { config } from '../../../config'
import { Blobs } from '@prisma/client'
import { blobRoutes } from '../../../routes'

const s3 = {
  region: config.s3.region,
  endPoint: config.s3.endPoint,
  bucket: config.s3.bucket,
  accessKey: config.s3.accessKey,
  secretAccessKey: config.s3.secretAccessKey
}

const s3Endpoint = `${config.s3.endPoint}/${config.s3.bucket}`

export class S3Service implements StorageService {
  async saveBlob({
    id,
    name,
    type,
    data,
    size,
    user_id
  }: SaveBlob): Promise<Blobs | null> {
    try {
      const s3blobUrl = await S3Service.uploadBlobToS3({
        user_id,
        data,
        type,
        name,
        id
      })
      if (!s3blobUrl) return null

      //NOTE: Save metadata to the database
      const blob = await DBService.saveBlobMetaData({
        id,
        user_id,
        blob_url: s3blobUrl,
        blob_id: null,
        type,
        name,
        size: size!
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
    const blobMetaData = await DBService.retrievBlobMetaData({
      id,
      user_id
    })
    if (!blobMetaData) return null

    //NOTE: getting the blob file
    const data = await S3Service.getBlobBuffer({ id: id + blobMetaData.name })

    const blobData: BlobData = {
      ...blobMetaData,
      data: data
    }

    return blobData
  }

  static async uploadBlobToS3({
    id,
    name,
    type,
    data
  }: SaveBlob): Promise<string | null> {
    //NOTE: uplaoding the file to the s3
    if (!supportedFileTypes.includes(type)) return null

    const buffer = Buffer.from(data, 'base64')
    const key = id + name

    const requestOptions = {
      method: 'PUT',
      url: `${s3Endpoint}/${key}`,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': buffer.length,
        Host: new URL(config.s3.endPoint).hostname
      },
      data: buffer
    }

    await S3.getSignedURL(requestOptions, s3)

    await axios(requestOptions)

    const publicUrl = `${config.s3.endPointUrl}/${config.s3.bucket}/${id + name}`

    return publicUrl
  }

  static async getBlobBuffer({ id }: { id: string }) {
    const key = id
    const requestOptions = {
      method: 'GET',
      url: `${s3Endpoint}/${key}`,
      headers: {
        Host: new URL(config.s3.endPoint).hostname
      }
    }

    await S3.getSignedURL(requestOptions, s3)

    const response = await axios(requestOptions)
    const data = Buffer.from(response.data)

    return data
  }
}
