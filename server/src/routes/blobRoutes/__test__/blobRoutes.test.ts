import * as fs from 'fs'
import * as path from 'path'
import { Blobs } from '@prisma/client'
import { describe, expect, it, vi, Mock } from 'vitest'
import { LocalFileService } from '../../../services'
import { DBService } from '../../../services/storage/DatabaseAdapter'

// Mock fs and DBService
vi.mock('fs', () => ({
  promises: {
    writeFile: vi.fn(),
    readFile: vi.fn()
  },
  existsSync: vi.fn(),
  mkdirSync: vi.fn()
}))

// Mock DBService methods
vi.mock('../../../services/storage/DatabaseAdapter', () => ({
  DBService: {
    saveBlobMetaData: vi.fn(),
    retrievBlobMetaData: vi.fn() // Ensure this is a function
  }
}))

const LocalFileServiceInstance = new LocalFileService()

describe('LocalFileService', () => {
  const blobMetaDataMock: Blobs = {
    id: 'test_id',
    name: 'file.txt',
    type: 'image/png',
    size: '123',
    user_id: 'test_user_id',
    blob_url: '',
    blob_id: null,
    createdAt: new Date() // Using a real date object here for consistency
  }

  describe('getBlob', () => {
    it('should retrieve the blob and metadata successfully', async () => {
      const buffer = Buffer.from('testdata')
      ;(fs.promises.readFile as Mock).mockResolvedValue(buffer)
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue({
        ...blobMetaDataMock,
        Blob: {
          data: buffer
        }
      })

      const result = await LocalFileServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toEqual({
        ...blobMetaDataMock,
        Blob: { data: buffer },
        data: buffer
      })
      expect(fs.promises.readFile).toHaveBeenCalledWith(
        path.join(__dirname, '../../../../', 'uploads', 'test_id')
      )
      expect(DBService.retrievBlobMetaData).toHaveBeenCalledWith({
        id: 'test_id',
        user_id: 'test_user_id'
      })
    })

    it('should return null if reading the file fails', async () => {
      ;(fs.promises.readFile as Mock).mockRejectedValue(
        new Error('Failed to read file')
      )

      const result = await LocalFileServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toBeNull()
    })

    it('should return null if retrieving metadata fails', async () => {
      ;(fs.promises.readFile as Mock).mockResolvedValue(Buffer.from('testdata'))
      ;(DBService.retrievBlobMetaData as Mock).mockResolvedValue(null)

      const result = await LocalFileServiceInstance.getBlob({
        id: 'test_id',
        user_id: 'test_user_id'
      })

      expect(result).toBeNull()
    })
  })
})
