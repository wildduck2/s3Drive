import { describe, it, expect } from 'vitest'
import crypto from 'crypto'
import { S3 } from '../s3'
import { RequestOptions } from '../s3.types'

describe('S3', () => {
  const accessKey = 'fakeAccessKey'
  const secretAccessKey = 'fakeSecretKey'
  const region = 'us-east-1'
  const url = 'https://example.com/path/to/object'

  it('should generate a signed URL for AWS S3', async () => {
    const request: RequestOptions = {
      method: 'GET',
      url,
      headers: {
        Host: new URL(url).host,
        'x-amz-content-sha256': crypto
          .createHash('sha256')
          .update('')
          .digest('hex'),
        'x-amz-date': new Date().toISOString().replace(/[:\-]|\.\d{3}/g, '')
      },
      data: Buffer.from('')
    }

    const signedUrl = await S3.getSignedURL(request, {
      accessKey,
      secretAccessKey,
      region
    })

    // Extract query parameters from the signed URL
    const urlParams = new URL(signedUrl).searchParams
    const expectedAlgorithm = 'AWS4-HMAC-SHA256'
    const expectedExpires = '86400'
    const expectedSignedHeaders = 'host;x-amz-content-sha256;x-amz-date'
    const expectedCredentialScope = `${new Date()
      .toISOString()
      .replace(/[:\-]|\.\d{3}/g, '')
      .substring(0, 8)}/${region}/s3/aws4_request`

    expect(urlParams.get('X-Amz-Algorithm')).toBe(expectedAlgorithm)
    expect(urlParams.get('X-Amz-Credential')).toContain(accessKey)
    expect(urlParams.get('X-Amz-Date')).toBeDefined()
    expect(urlParams.get('X-Amz-Expires')).toBe(expectedExpires)
    expect(urlParams.get('X-Amz-SignedHeaders')).toBe(expectedSignedHeaders)
    expect(urlParams.get('X-Amz-Signature')).toBeDefined()
  })

  it('should generate the HMAC-SHA256 signing key for AWS Signature Version 4', () => {
    const date = new Date()
      .toISOString()
      .replace(/[:\-]|\.\d{3}/g, '')
      .substring(0, 8)
    const service = 's3'

    const signingKey = S3.getSignatureKey(
      secretAccessKey,
      date,
      region,
      service
    )
    const expectedSigningKey = crypto
      .createHmac('sha256', 'AWS4' + secretAccessKey)
      .update(date)
      .digest()
    const kRegion = crypto
      .createHmac('sha256', expectedSigningKey)
      .update(region)
      .digest()
    const kService = crypto
      .createHmac('sha256', kRegion)
      .update(service)
      .digest()
    const expectedFinalKey = crypto
      .createHmac('sha256', kService)
      .update('aws4_request')
      .digest()

    expect(signingKey.toString('hex')).toBe(expectedFinalKey.toString('hex'))
  })
})
