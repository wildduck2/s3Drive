import axios, { AxiosProgressEvent } from 'axios'
import { SaveBlob } from '../..'
import { S3 } from '../../../utils/s3'
import { supportedFileTypes } from '../../../constants'
import { config } from '../../../config'
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3'
import { compileFunction } from 'vm'

interface ListObjectsOptions {
  bucketName: string
  prefix?: string
  delimiter?: string
  maxKeys?: number
  startAfter?: string
  accessKeyId: string
  secretAccessKey: string
  endpoint: string // Endpoint URL for Supabase S3
}

const s3 = {
  region: config.s3.region,
  endPoint: config.s3.endPoint,
  bucket: config.s3.bucket,
  accessKey: config.s3.accessKey,
  secretAccessKey: config.s3.secretAccessKey
}
const s3Endpoint = `${config.s3.endPoint}/${config.s3.bucket}`

/**
 * A service class for interacting with AWS S3 for uploading and retrieving files.
 */
export class S3Service {
  /**
   * Saves a blob of data to the S3 storage and returns a public URL for accessing it.
   *
   * @param blob - The blob data including id, name, type, and base64 encoded data.
   * @param blob.id - The unique identifier for the blob.
   * @param blob.name - The name of the blob.
   * @param blob.type - The MIME type of the blob.
   * @param blob.data - The base64 encoded data of the blob.
   * @returns A promise that resolves to the public URL of the uploaded blob, or `null` if an error occurs.
   *
   * @throws {Error} Throws an error if the upload process fails, including issues with invalid file types, network problems, or upload errors.
   */
  static async saveBlob({
    id,
    name,
    type,
    data
  }: SaveBlob): Promise<string | null> {
    try {
      // Validate the MIME type of the blob
      if (!supportedFileTypes.includes(type)) return null

      // Convert base64 data to Buffer
      const buffer = Buffer.from(data, 'base64')
      const key = id + name

      // Prepare request options for uploading the file
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

      // Sign the URL for the request
      await S3.getSignedURL(requestOptions, s3)

      // Upload the file using Axios
      await axios(requestOptions)

      // Generate a public URL for the uploaded file
      const publicUrl = `https://aihutnqdfsogyehkbgml.supabase.co/storage/v1/object/public/${config.s3.bucket}/${id + name}`

      return publicUrl
    } catch (error) {
      console.log(error)
      return null
    }
  }

  /**
   * Retrieves a blob of data from the S3 storage using the provided identifier.
   *
   * @param params - Parameters for retrieving the blob.
   * @param params.id - The unique identifier of the blob to retrieve.
   * @returns A promise that resolves to a `Buffer` containing the retrieved blob data.
   *
   * @throws {Error} Throws an error if the retrieval fails, including network issues or invalid responses.
   */
  static async getBlob({ id }: { id: string }): Promise<Buffer> {
    const key = id

    // Prepare request options for retrieving the file
    const requestOptions = {
      method: 'GET',
      url: `${s3Endpoint}/${key}`,
      headers: {
        Host: new URL(config.s3.endPoint).hostname
      }
    }

    // Sign the URL for the request
    await S3.getSignedURL(requestOptions, s3)

    // Retrieve the file using Axios
    const response = await axios(requestOptions)
    const data = Buffer.from(response.data)

    return data
  }
  /**
   * Lists the contents of the S3 bucket.
   *
   * This method retrieves a list of objects stored in the S3-compatible storage bucket.
   *
   * @returns A promise that resolves to an array of objects representing the contents of the bucket, or `null` if an error occurs.
   *
   * @throws {Error} Throws an error if the request fails, including issues with network problems or response errors.
   */
  static async listS3Objects(): Promise<any[]> {
    // try {
    //   // Construct the request options for ListObjectsV2 equivalent operation
    //   const request = {
    //     method: 'GET',
    //     url: `${config.s3.endPoint}/${config.s3.bucket}?list-type=2&max-keys=10`,
    //     headers: {
    //       Host: new URL(config.s3.endPoint).hostname
    //     }
    //   }
    //
    //   // Generate a signed URL for the request
    //   const signedUrl = await S3.getSignedURL(request, config.s3)
    //
    //   if (!signedUrl) return []
    //
    //   // Make the HTTP GET request using the signed URL
    //   const response = await axios.get(signedUrl)
    //
    //   // Assuming the response structure matches what AWS SDK would return
    //   // You might need to adjust this based on the actual XML or JSON response structure
    //   return response.data.Contents || []
    // } catch (error) {
    //   return error
    // }
    const client = new S3Client({
      region: config.s3.region,
      credentials: {
        accessKeyId: config.s3.accessKey,
        secretAccessKey: config.s3.secretAccessKey
      },
      endpoint: config.s3.endPoint,
      forcePathStyle: true
    })

    const results: any[] = []

    const command = new ListObjectsV2Command({
      Bucket: config.s3.bucket,
      Prefix: '',
      Delimiter: '',
      MaxKeys: 10,
      StartAfter: ''
    })

    try {
      const response = await client.send(command)

      if (response.Contents) {
        results.push(...response.Contents)
      }
    } catch (error) {
      console.error('Error listing objects:', error)
      throw error
    }

    return results
  }
}
