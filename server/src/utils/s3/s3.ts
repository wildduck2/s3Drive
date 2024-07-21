import crypto from 'crypto'
import { RequestOptions } from './s3.types'

/**
 * A class for interacting with AWS S3 using Signature Version 4 (SigV4) for signing requests.
 */
export class S3 {
  /**
   * Generates a signed URL for making authenticated requests to AWS S3.
   *
   * @param request - The request options including method, URL, headers, and data.
   * @param credentials - AWS credentials including access key, secret access key, and region.
   * @returns A promise that resolves to the signed URL if successful, or null if an error occurs.
   */
  static async getSignedURL(
    request: RequestOptions,
    {
      accessKey,
      secretAccessKey,
      region
    }: { accessKey: string; secretAccessKey: string; region: string }
  ) {
    const { method, url, headers, data } = request

    // Generate AWS date and date stamp
    const amzDate = new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
    const dateStamp = amzDate.substring(0, 8)

    // Update headers with AWS-specific headers
    // @ts-expect-error header
    headers['x-amz-date'] = amzDate
    // @ts-expect-error header
    headers['x-amz-content-sha256'] = crypto
      .createHash('sha256')
      .update(data || '')
      .digest('hex')

    // Construct canonical headers and request
    const canonicalHeaders = Object.keys(headers)
      .sort()
      // @ts-expect-error header
      .map((key) => `${key.toLowerCase()}:${headers[key]}`)
      .join('\n')

    const signedHeaders = Object.keys(headers)
      .sort()
      .map((key) => key.toLowerCase())
      .join(';')

    const canonicalRequest = [
      method,
      new URL(url).pathname,
      new URL(url).search,
      canonicalHeaders + '\n',
      signedHeaders,
      // @ts-expect-error header
      headers['x-amz-content-sha256']
    ].join('\n')

    // Generate string to sign
    const algorithm = 'AWS4-HMAC-SHA256'
    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      crypto.createHash('sha256').update(canonicalRequest).digest('hex')
    ].join('\n')

    // Generate signing key and signature
    const signingKey = this.getSignatureKey(
      secretAccessKey,
      dateStamp,
      region,
      's3'
    )
    const signature = crypto
      .createHmac('sha256', signingKey)
      .update(stringToSign)
      .digest('hex')

    // Set the Authorization header
    // @ts-expect-error header
    headers['Authorization'] =
      `${algorithm} Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    // Construct the signed URL
    const encodedCredentialScope = encodeURIComponent(credentialScope)
    const encodedSignedHeaders = encodeURIComponent(signedHeaders)
    const encodedSignature = encodeURIComponent(signature)

    const signedUrl = `${url}?X-Amz-Algorithm=${algorithm}&X-Amz-Credential=${encodeURIComponent(accessKey)}%2F${encodedCredentialScope}&X-Amz-Date=${amzDate}&X-Amz-Expires=86400&X-Amz-SignedHeaders=${encodedSignedHeaders}&X-Amz-Signature=${encodedSignature}`

    return signedUrl
  }

  /**
   * Generates the HMAC-SHA256 signing key for AWS Signature Version 4.
   *
   * @param key - The AWS secret access key.
   * @param date - The date stamp in `YYYYMMDD` format.
   * @param region - The AWS region.
   * @param service - The AWS service name (e.g., 's3').
   * @returns The HMAC-SHA256 signing key as a Buffer.
   */
  static getSignatureKey(
    key: string,
    date: string,
    region: string,
    service: string
  ): Buffer {
    //NOTE: Key Derivation
    const kDate = crypto
      .createHmac('sha256', 'AWS4' + key)
      .update(date)
      .digest()
    const kRegion = crypto.createHmac('sha256', kDate).update(region).digest()
    const kService = crypto
      .createHmac('sha256', kRegion)
      .update(service)
      .digest()
    return crypto.createHmac('sha256', kService).update('aws4_request').digest()
  }
}
