import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { config } from '../../config'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetSignedUrlType } from './s3.types'

export const s3Client = new S3Client({
  forcePathStyle: true,
  region: config.s3.region,
  endpoint: config.s3.endPoint,
  credentials: {
    accessKeyId: config.s3.accessKey,
    secretAccessKey: config.s3.secretAccessKey
  }
})
export class S3 {
  static async getSignedURl({
    id,
    name,
    type
  }: GetSignedUrlType): Promise<string | null> {
    const putObjectCommand = new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: id + name,
      ContentType: type
    })

    try {
      const signedUrl = await getSignedUrl(s3Client, putObjectCommand, {
        expiresIn: 60
      })
      if (!signedUrl) return null

      return signedUrl
    } catch (error) {
      return null
    }
  }
}
