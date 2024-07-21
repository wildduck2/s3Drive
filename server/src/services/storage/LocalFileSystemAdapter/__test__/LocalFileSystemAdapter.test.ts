import * as fs from 'fs'
import * as path from 'path'
import { Mock, describe, expect, it, vi } from 'vitest'
import { SaveBlob } from '../../../AdapterService'
import { LocalFileService } from '../LocalFileSystemAdapter'
import { DBService } from '../../DatabaseAdapter'
import { Blobs } from '../../../../../prisma/generated/client'

// Mock fs and DBService
vi.mock('fs', () => ({
    promises: {
        writeFile: vi.fn(),
        readFile: vi.fn()
    },
    existsSync: vi.fn(),
    mkdirSync: vi.fn()
}))

vi.mock('../../DatabaseAdapter', () => ({
    DBService: {
        saveBlobMetaData: vi.fn(),
        retrievBlobMetaData: vi.fn()
    }
}))

const LocalFileServiceInstance = new LocalFileService()

describe('LocalFileService', () => {
    const blobMock: SaveBlob = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        data: 'testdata',
        size: '123',
        user_id: 'test_user_id'
    }

    const blobMetaDataMock: Blobs = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        size: '123',
        user_id: 'test_user_id',
        blob_url: '',
        blob_id: null,
        createdAt: expect.any(Date)
    }

    describe('saveBlob', () => {
        it('should save the blob and metadata successfully', async () => {
            ; (fs.promises.writeFile as Mock).mockResolvedValue(undefined)
                ; (DBService.saveBlobMetaData as Mock).mockResolvedValue(blobMetaDataMock)

            const result = await LocalFileServiceInstance.saveBlob(blobMock)

            expect(result).toEqual(blobMetaDataMock)
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', blobMock.id),
                blobMock.data
            )
            expect(DBService.saveBlobMetaData).toHaveBeenCalledWith({
                id: blobMock.id,
                user_id: blobMock.user_id,
                type: blobMock.type,
                name: blobMock.name,
                size: blobMock.size!,
                blob_url: '',
                blob_id: null
            })
        })

        it('should return null if saving the file fails', async () => {
            ; (fs.promises.writeFile as Mock).mockRejectedValue(
                new Error('Failed to save file')
            )

            const result = await LocalFileServiceInstance.saveBlob(blobMock)

            expect(result).toBeNull()
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', blobMock.id),
                blobMock.data
            )
        })

        it('should return null if saving metadata fails', async () => {
            ; (fs.promises.writeFile as Mock).mockResolvedValue(undefined)
                ; (DBService.saveBlobMetaData as Mock).mockResolvedValue(null)

            const result = await LocalFileServiceInstance.saveBlob(blobMock)

            expect(result).toBeNull()
            expect(fs.promises.writeFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', blobMock.id),
                blobMock.data
            )
        })
    })

    describe('getBlob', () => {
        it('should retrieve the blob and metadata successfully', async () => {
            ; (fs.promises.readFile as Mock).mockResolvedValue(Buffer.from('testdata'))
                ; (DBService.retrievBlobMetaData as Mock).mockResolvedValue({
                    ...blobMetaDataMock,
                    Blob: {
                        data: Buffer.from('testdata')
                    }
                })

            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            })

            expect(result).toEqual({
                ...blobMetaDataMock,
                Blob: { data: Buffer.from('testdata') },
                data: Buffer.from('testdata')
            })
            expect(fs.promises.readFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', 'test_id')
            )
            expect(DBService.retrievBlobMetaData).toHaveBeenCalledWith({
                id: 'test_id',
                user_id: 'test_user_id'
            })
        })

        it('should return null if reading the file fails', async () => {
            ; (fs.promises.readFile as Mock).mockRejectedValue(
                new Error('Failed to read file')
            )

            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            })

            expect(result).toBeNull()
            expect(fs.promises.readFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', 'test_id')
            )
        })

        it('should return null if retrieving metadata fails', async () => {
            ; (fs.promises.readFile as Mock).mockResolvedValue(Buffer.from('testdata'))
                ; (DBService.retrievBlobMetaData as Mock).mockResolvedValue(null)

            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            })

            expect(result).toBeNull()
            expect(fs.promises.readFile).toHaveBeenCalledWith(
                path.join(__dirname, '../../../../../', 'uploads', 'test_id')
            )
        })
    })
})
