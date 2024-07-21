import { describe, it, expect, vi, Mock, beforeEach } from 'vitest'
import axios from 'axios'
import { AmazonS3Adapter } from '../AmazonS3Adapter' // Adjust the import path
import { DBService } from '../..' // Adjust the import path
import { S3 } from '../../../../utils/s3'

// Mock the dependencies
vi.mock('axios')

vi.mock('../../../../utils/s3', () => ({
  S3: {
    getSignedURL: vi.fn()
  }
}))
vi.mock('../..', () => ({
  DBService: {
    saveBlobMetaData: vi.fn(),
    retrievBlobMetaData: vi.fn()
  }
}))

const s3Service = new AmazonS3Adapter()

const mockS3Url =
  'https://aihutnqdfsogyehkbgml.supabase.co/storage/v1/object/public/upload/test_idfile.txt'

const resultMocked = {
  id: 'test_id',
  name: 'file.txt',
  type: 'image/png',
  data: Buffer.from('testbase'),
  size: '123',
  user_id: 'test_user'
}

const mockBlob = {
  blob_url: mockS3Url,
  blob_id: null,
  ...resultMocked
}

const mockedMetaData = {
  Blob: {
    data: Buffer.from('testbase')
  },
  ...mockBlob
}

describe('AmazonS3Adapter', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('saveBlob', () => {
    it('should return null if uploadBlobToS3 fails', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue(null)
      ;(axios as unknown as Mock).mockResolvedValue(null)

      const result = await s3Service.saveBlob({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toBeNull()
    })

    it('should return null if uploadBlobToS3 fails with error throw', async () => {
      ;(S3.getSignedURL as Mock).mockRejectedValue(null)
      ;(axios as unknown as Mock).mockRejectedValue(null)

      const result = await s3Service.saveBlob({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toBeNull()
    })

    it('should return null if saveBlobMetaData fails', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: 'testbase'
      })
      ;(DBService.saveBlobMetaData as Mock).mockResolvedValue(null)

      const result = await s3Service.saveBlob({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toBeNull()
    })

    it('should return null if saveBlobMetaData fails with error throw', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: 'testbase'
      })
      ;(DBService.saveBlobMetaData as Mock).mockRejectedValue(null)

      const result = await s3Service.saveBlob({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toBeNull()
    })

    it('should return blob metadata if all went okay', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: 'testbase'
      })
      ;(DBService.saveBlobMetaData as Mock).mockResolvedValue(mockedMetaData)

      const result = await s3Service.saveBlob({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toEqual(mockedMetaData)
    })
  })

  describe('testing getBlob', () => {
    it('should return null if retrievBlobMetaData failed with erro throw', async () => {
      ;(DBService.retrievBlobMetaData as Mock).mockRejectedValue(null)

      const result = await s3Service.getBlob({
        id: 'test_id',
        user_id: 'test_id'
      })
      expect(result).toBeNull()
      expect(DBService.retrievBlobMetaData).toHaveBeenCalledOnce()
    })

    it('should return null if retrievBlobMetaData failed', async () => {
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue(null)

      const result = await s3Service.getBlob({
        id: 'test_id',
        user_id: 'test_id'
      })
      expect(result).toBeNull()
    })

    it('should return null if get blob data failed', async () => {
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue(mockedMetaData)
      ;(S3.getSignedURL as Mock).mockResolvedValue(null)
      ;(axios as unknown as Mock).mockResolvedValue(null)

      const result = await s3Service.getBlob({
        id: 'test_id',
        user_id: 'test_id'
      })
      expect(result).toBeNull()
    })

    it('should return null if get blob data failed with error throw', async () => {
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue(mockedMetaData)
      ;(S3.getSignedURL as Mock).mockRejectedValue(null)
      ;(axios as unknown as Mock).mockRejectedValue(null)

      const result = await s3Service.getBlob({
        id: 'test_id',
        user_id: 'test_id'
      })
      expect(result).toBeNull()
    })

    it('should return data if all went okay', async () => {
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue(mockedMetaData)
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: Buffer.from('testbase')
      })

      const s3Service = new AmazonS3Adapter()

      const result = await s3Service.getBlob({
        id: 'test_id',
        user_id: 'test_id'
      })

      expect(result).toEqual(mockedMetaData)
    })
  })

  //NOTE: testing uploadBlobToS3
  describe('testing uploadBlobToS3', () => {
    it('should return upload url if all went okay', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: 'testbase'
      })

      const result = await AmazonS3Adapter.uploadBlobToS3({
        ...resultMocked,
        data: 'testbase'
      })

      expect(result).toEqual(mockS3Url)
    })

    it('should return null if the type is not in my list', async () => {
      const result = await AmazonS3Adapter.uploadBlobToS3({
        ...resultMocked,
        data: 'testbase',
        type: 'wrong_type'
      })

      expect(result).toBeNull()
    })

    it('should return null if the url failed to get', async () => {
      ;(S3.getSignedURL as Mock).mockRejectedValue(null)

      const result = await AmazonS3Adapter.uploadBlobToS3({
        ...resultMocked,
        data: 'testbase',
        type: 'wrong_type'
      })

      expect(result).toBeNull()
    })

    it('should return null if the url failed with error throw', async () => {
      ;(S3.getSignedURL as Mock).mockRejectedValue(null)

      const result = await AmazonS3Adapter.uploadBlobToS3({
        ...resultMocked,
        data: 'testbase',
        type: 'wrong_type'
      })

      expect(result).toBeNull()
    })

    it('should return null if the axios failed with error throw', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockRejectedValue({ error: 'failed' })

      const result = await AmazonS3Adapter.uploadBlobToS3({
        ...resultMocked,
        data: 'testbase',
        type: 'wrong_type'
      })

      expect(result).toBeNull()
    })
  })

  //NOTE: testing getBlobBuffer
  describe('testing getBlobBuffer', () => {
    it('should return buffer Data', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockResolvedValue({
        data: Buffer.from('testbase').toString('base64')
      })

      const result = await AmazonS3Adapter.getBlobBuffer({ id: 'test_id' })

      expect(result).toEqual(Buffer.from('testbase'))
    })

    it('should return null if getting signed url failed with null value', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue(null)
      ;(axios as unknown as Mock).mockResolvedValue({})

      const result = await AmazonS3Adapter.getBlobBuffer({ id: 'test_id' })

      expect(result).toBeNull()
    })

    it('should return null if getting signed url failed with throw error', async () => {
      ;(S3.getSignedURL as Mock).mockRejectedValue(null)
      ;(axios as unknown as Mock).mockResolvedValue({})

      const result = await AmazonS3Adapter.getBlobBuffer({ id: 'test_id' })

      expect(result).toBeNull()
    })

    it('should return null if axios failed', async () => {
      ;(S3.getSignedURL as Mock).mockResolvedValue('test_url')
      ;(axios as unknown as Mock).mockRejectedValue(null)

      const result = await AmazonS3Adapter.getBlobBuffer({ id: 'test_id' })

      expect(result).toBeNull()
    })
  })
})
