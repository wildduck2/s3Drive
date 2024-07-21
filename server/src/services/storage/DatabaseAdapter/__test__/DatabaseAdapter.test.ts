import { DBService } from '../..'
import { Mock, describe, expect, it, vi } from 'vitest'
import { prisma } from '../../../..'
import { SaveBlob } from '../../../AdapterService'

// Mocking prisma
vi.mock('../../../..', () => ({
  prisma: {
    blob: {
      create: vi.fn()
    },
    blobs: {
      create: vi.fn(),
      findUnique: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn()
    }
  }
}))

const DBServiceInstance = new DBService()

describe('DBService Tests', () => {
  const saveBlobMock: SaveBlob = {
    id: 'test_id',
    name: 'file.txt',
    type: 'image/png',
    data: 'dGVzdGJhc2U=', // base64 for 'testbase'
    size: '123',
    user_id: 'test_user_id'
  }

  const blobDataMock = {
    id: 'test_id',
    data: Buffer.from('testbase', 'base64')
  }

  const blobMetaDataMock = {
    id: 'test_id',
    name: 'file.txt',
    type: 'image/png',
    size: '123',
    user_id: 'test_user_id',
    blob_url: 'https://example.com/blob',
    blob_id: 'blob_id'
  }

  //NOTE: Tests for saveBlob
  describe('saveBlob', () => {
    it('should return blob data if save and metadata creation are successful', async () => {
      ;(prisma.blob.create as Mock).mockResolvedValue(blobDataMock)
      ;(prisma.blobs.create as Mock).mockResolvedValue(blobMetaDataMock)

      const result = await DBServiceInstance.saveBlob(saveBlobMock)
      expect(result).toEqual(blobMetaDataMock)
    })

    it('should return null if blob creation fails with error', async () => {
      ;(prisma.blob.create as Mock).mockRejectedValue(null)

      const result = await DBServiceInstance.saveBlob(saveBlobMock)

      expect(result).toBeNull()
    })

    it('should return null if blob creation fails fails with error', async () => {
      ;(prisma.blob.create as Mock).mockResolvedValue(blobDataMock)
      DBService.saveBlobMetaData = vi.fn().mockRejectedValue(null)

      const result = await DBServiceInstance.saveBlob(saveBlobMock)

      expect(result).toBeNull()
    })

    it('should return null if metadata save fails', async () => {
      ;(prisma.blob.create as Mock).mockResolvedValue(null)
      DBService.saveBlobMetaData = vi.fn().mockResolvedValue(null)

      const result = await DBServiceInstance.saveBlob(saveBlobMock)

      expect(result).toBeNull()
    })
  })

  //NOTE: Tests for getBlob
  describe('getBlob', () => {
    it('should return blob data if metadata retrieval is successful', async () => {
      DBService.retrievBlobMetaData = vi
        .fn()
        .mockResolvedValue(blobMetaDataMock)

      const result = await DBServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toEqual(blobMetaDataMock)
    })

    it('should return null if metadata retrieval fails', async () => {
      DBService.retrievBlobMetaData = vi.fn().mockResolvedValue(null)

      const result = await DBServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toBeNull()
    })

    it('should return null if metadata retrieval fails', async () => {
      DBService.retrievBlobMetaData = vi.fn().mockRejectedValue(null)

      const result = await DBServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toBeNull()
    })
  })

  //NOTE: Tests for saveBlobMetaData
  describe('saveBlobMetaData', () => {
    it('should return saved blob metadata if successful', async () => {
      ;(prisma.blobs.create as Mock).mockResolvedValue(blobMetaDataMock)

      const result = await DBService.saveBlobMetaData(blobMetaDataMock)

      // expect(result).toEqual(blobMetaDataMock)
    })

    it('should return null if saving metadata fails', async () => {
      ;(prisma.blobs.create as Mock).mockRejectedValue(null)

      const result = await DBService.saveBlobMetaData(blobMetaDataMock)

      expect(result).toBeNull()
    })
  })

  //NOTE: Tests for retrievBlobMetaData
  describe('retrievBlobMetaData', () => {
    it('should return blob metadata if successful', async () => {
      prisma.blobs.findUnique = vi.fn().mockResolvedValue({
        ...blobMetaDataMock,
        Blob: {
          data: Buffer.from('testdata')
        }
      })

      // const result = await DBService.retrievBlobMetaData({
      //   id: 'test_id',
      //   user_id: 'test_user_id'
      // })

      // expect(result).toEqual({
      //   ...blobMetaDataMock,
      //   Blob: {
      //     data: Buffer.from('testdata')
      //   }
      // })
    })

    // it('should return null if metadata retrieval fails', async () => {
    //   // Mock failed database query
    //   ;(prisma.blobs.findUnique as Mock).mockRejectedValue(
    //     new Error('Failed to retrieve metadata')
    //   )
    //
    //   const result = await DBService.retrievBlobMetaData({
    //     id: 'test_id',
    //     user_id: 'test_user_id'
    //   })
    //
    //   expect(result).toBeNull()
    // })
    //
    // it('should return null if no metadata is found', async () => {
    //   ;(prisma.blobs.findUnique as Mock).mockResolvedValue(null)
    //
    //   const result = await DBService.retrievBlobMetaData({
    //     id: 'test_id',
    //     user_id: 'test_user_id'
    //   })
    //
    //   expect(result).toBeNull()
    // })
  })

  //NOTE: listBlobsMetaData
  describe('listBlobsMetaData', () => {
    it('should return list of blobs with pagination data if successful', async () => {
      ;(prisma.blobs.findMany as Mock).mockResolvedValue([blobMetaDataMock])
      ;(prisma.blobs.count as Mock).mockResolvedValue(1)

      const result = await DBService.listBlobsMetaData({
        page: '1',
        pageSize: '10'
      })

      expect(result).toEqual({
        blobs: [blobMetaDataMock],
        pagination: {
          page: 1,
          nextPage: null,
          prevPage: null,
          pageSize: 10,
          totalCount: 1,
          totalPages: 1
        }
      })
    })

    it('should return null if listing blobs fails', async () => {
      ;(prisma.blobs.findMany as Mock).mockRejectedValue(
        new Error('Failed to list blobs')
      )

      const result = await DBService.listBlobsMetaData({
        page: '1',
        pageSize: '10'
      })

      expect(result).toBeNull()
    })
  })
})
