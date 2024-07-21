"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("../..");
const vitest_1 = require("vitest");
const __2 = require("../../../..");
// Mocking prisma
vitest_1.vi.mock('../../../..', () => ({
    prisma: {
        blob: {
            create: vitest_1.vi.fn()
        },
        blobs: {
            create: vitest_1.vi.fn(),
            findUnique: vitest_1.vi.fn(),
            findMany: vitest_1.vi.fn(),
            count: vitest_1.vi.fn()
        }
    }
}));
const DBServiceInstance = new __1.DBService();
(0, vitest_1.describe)('DBService Tests', () => {
    const saveBlobMock = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        data: 'dGVzdGJhc2U=', // base64 for 'testbase'
        size: '123',
        user_id: 'test_user_id'
    };
    const blobDataMock = {
        id: 'test_id',
        data: Buffer.from('testbase', 'base64')
    };
    const blobMetaDataMock = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        size: '123',
        user_id: 'test_user_id',
        blob_url: 'https://example.com/blob',
        blob_id: 'blob_id'
    };
    //NOTE: Tests for saveBlob
    (0, vitest_1.describe)('saveBlob', () => {
        (0, vitest_1.it)('should return blob data if save and metadata creation are successful', async () => {
            ;
            __2.prisma.blob.create.mockResolvedValue(blobDataMock);
            __2.prisma.blobs.create.mockResolvedValue(blobMetaDataMock);
            const result = await DBServiceInstance.saveBlob(saveBlobMock);
            (0, vitest_1.expect)(result).toEqual(blobMetaDataMock);
        });
        (0, vitest_1.it)('should return null if blob creation fails with error', async () => {
            ;
            __2.prisma.blob.create.mockRejectedValue(null);
            const result = await DBServiceInstance.saveBlob(saveBlobMock);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if blob creation fails fails with error', async () => {
            ;
            __2.prisma.blob.create.mockResolvedValue(blobDataMock);
            __1.DBService.saveBlobMetaData = vitest_1.vi.fn().mockRejectedValue(null);
            const result = await DBServiceInstance.saveBlob(saveBlobMock);
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if metadata save fails', async () => {
            ;
            __2.prisma.blob.create.mockResolvedValue(null);
            __1.DBService.saveBlobMetaData = vitest_1.vi.fn().mockResolvedValue(null);
            const result = await DBServiceInstance.saveBlob(saveBlobMock);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    //NOTE: Tests for getBlob
    (0, vitest_1.describe)('getBlob', () => {
        (0, vitest_1.it)('should return blob data if metadata retrieval is successful', async () => {
            __1.DBService.retrievBlobMetaData = vitest_1.vi
                .fn()
                .mockResolvedValue(blobMetaDataMock);
            const result = await DBServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toEqual(blobMetaDataMock);
        });
        (0, vitest_1.it)('should return null if metadata retrieval fails', async () => {
            __1.DBService.retrievBlobMetaData = vitest_1.vi.fn().mockResolvedValue(null);
            const result = await DBServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if metadata retrieval fails', async () => {
            __1.DBService.retrievBlobMetaData = vitest_1.vi.fn().mockRejectedValue(null);
            const result = await DBServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    //NOTE: Tests for saveBlobMetaData
    (0, vitest_1.describe)('saveBlobMetaData', () => {
        (0, vitest_1.it)('should return saved blob metadata if successful', async () => {
            ;
            __2.prisma.blobs.create.mockResolvedValue(blobMetaDataMock);
            const result = await __1.DBService.saveBlobMetaData(blobMetaDataMock);
            // expect(result).toEqual(blobMetaDataMock)
        });
        (0, vitest_1.it)('should return null if saving metadata fails', async () => {
            ;
            __2.prisma.blobs.create.mockRejectedValue(null);
            const result = await __1.DBService.saveBlobMetaData(blobMetaDataMock);
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    //NOTE: Tests for retrievBlobMetaData
    (0, vitest_1.describe)('retrievBlobMetaData', () => {
        (0, vitest_1.it)('should return blob metadata if successful', async () => {
            __2.prisma.blobs.findUnique = vitest_1.vi.fn().mockResolvedValue({
                ...blobMetaDataMock,
                Blob: {
                    data: Buffer.from('testdata')
                }
            });
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
        });
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
    });
    //NOTE: listBlobsMetaData
    (0, vitest_1.describe)('listBlobsMetaData', () => {
        (0, vitest_1.it)('should return list of blobs with pagination data if successful', async () => {
            ;
            __2.prisma.blobs.findMany.mockResolvedValue([blobMetaDataMock]);
            __2.prisma.blobs.count.mockResolvedValue(1);
            const result = await __1.DBService.listBlobsMetaData({
                page: '1',
                pageSize: '10'
            });
            (0, vitest_1.expect)(result).toEqual({
                blobs: [blobMetaDataMock],
                pagination: {
                    page: 1,
                    nextPage: null,
                    prevPage: null,
                    pageSize: 10,
                    totalCount: 1,
                    totalPages: 1
                }
            });
        });
        (0, vitest_1.it)('should return null if listing blobs fails', async () => {
            ;
            __2.prisma.blobs.findMany.mockRejectedValue(new Error('Failed to list blobs'));
            const result = await __1.DBService.listBlobsMetaData({
                page: '1',
                pageSize: '10'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
});
