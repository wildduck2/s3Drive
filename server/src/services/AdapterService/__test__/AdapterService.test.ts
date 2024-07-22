import { describe, it, expect, vi } from 'vitest'
import { AdapterService, StorageType } from '../AdapterService'
import { DBService, LocalFileService, AmazonS3Adapter } from '../../storage'

// Mock the service classes
vi.mock('../storage', () => ({
    DBService: vi.fn().mockImplementation(() => ({})),
    FTPService: vi.fn().mockImplementation(() => ({})),
    LocalFileService: vi.fn().mockImplementation(() => ({})),
    S3Service: vi.fn().mockImplementation(() => ({}))
}))

describe('AdapterService', () => {
    it('should initialize S3Service for AMAZON_S3 storage type', () => {
        const service = new AdapterService(StorageType.AMAZON_S3)
        expect(service.adapter).toBeInstanceOf(AmazonS3Adapter)
    })

    it('should initialize DBService for DATABASE storage type', () => {
        const service = new AdapterService(StorageType.DATABASE)
        expect(service.adapter).toBeInstanceOf(DBService)
    })

    it('should initialize LocalFileService for LOCAL storage type', () => {
        const service = new AdapterService(StorageType.LOCAL)
        expect(service.adapter).toBeInstanceOf(LocalFileService)
    })

    // it('should initialize FTPService for FTP storage type', () => {
    //     const service = new AdapterService(StorageType.FTP)
    //     expect(service.adapter).toBeInstanceOf(FTPService)
    // })

    it('should not initialize any service for an invalid storage type', () => {
        const invalidStorageType = 'INVALID_TYPE' as unknown as StorageType
        const service = new AdapterService(invalidStorageType)
        expect(service.adapter).toBeUndefined()
    })
})
