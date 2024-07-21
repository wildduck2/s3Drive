"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const axios_1 = __importDefault(require("axios"));
const AmazonS3Adapter_1 = require("../AmazonS3Adapter"); // Adjust the import path
const __1 = require("../.."); // Adjust the import path
const s3_1 = require("../../../../utils/s3");
// Mock the dependencies
vitest_1.vi.mock('axios');
vitest_1.vi.mock('../../../../utils/s3', () => ({
    S3: {
        getSignedURL: vitest_1.vi.fn()
    }
}));
vitest_1.vi.mock('../..', () => ({
    DBService: {
        saveBlobMetaData: vitest_1.vi.fn(),
        retrievBlobMetaData: vitest_1.vi.fn()
    }
}));
const s3Service = new AmazonS3Adapter_1.AmazonS3Adapter();
const mockS3Url = 'https://aihutnqdfsogyehkbgml.supabase.co/storage/v1/object/public/upload/test_idfile.txt';
const resultMocked = {
    id: 'test_id',
    name: 'file.txt',
    type: 'image/png',
    data: Buffer.from('testbase'),
    size: '123',
    user_id: 'test_user'
};
const mockBlob = {
    blob_url: mockS3Url,
    blob_id: null,
    ...resultMocked
};
const mockedMetaData = {
    Blob: {
        data: Buffer.from('testbase')
    },
    ...mockBlob
};
(0, vitest_1.describe)('AmazonS3Adapter', () => {
    (0, vitest_1.beforeEach)(() => {
        vitest_1.vi.clearAllMocks();
    });
    (0, vitest_1.describe)('saveBlob', () => {
        (0, vitest_1.it)('should return null if uploadBlobToS3 fails', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue(null);
            axios_1.default.mockResolvedValue(null);
            const result = await s3Service.saveBlob({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if uploadBlobToS3 fails with error throw', async () => {
            ;
            s3_1.S3.getSignedURL.mockRejectedValue(null);
            axios_1.default.mockRejectedValue(null);
            const result = await s3Service.saveBlob({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if saveBlobMetaData fails', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: 'testbase'
            });
            __1.DBService.saveBlobMetaData.mockResolvedValue(null);
            const result = await s3Service.saveBlob({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if saveBlobMetaData fails with error throw', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: 'testbase'
            });
            __1.DBService.saveBlobMetaData.mockRejectedValue(null);
            const result = await s3Service.saveBlob({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return blob metadata if all went okay', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: 'testbase'
            });
            __1.DBService.saveBlobMetaData.mockResolvedValue(mockedMetaData);
            const result = await s3Service.saveBlob({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toEqual(mockedMetaData);
        });
    });
    (0, vitest_1.describe)('testing getBlob', () => {
        (0, vitest_1.it)('should return null if retrievBlobMetaData failed with erro throw', async () => {
            ;
            __1.DBService.retrievBlobMetaData.mockRejectedValue(null);
            const result = await s3Service.getBlob({
                id: 'test_id',
                user_id: 'test_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
            (0, vitest_1.expect)(__1.DBService.retrievBlobMetaData).toHaveBeenCalledOnce();
        });
        (0, vitest_1.it)('should return null if retrievBlobMetaData failed', async () => {
            ;
            __1.DBService.retrievBlobMetaData.mockResolvedValue(null);
            const result = await s3Service.getBlob({
                id: 'test_id',
                user_id: 'test_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if get blob data failed', async () => {
            ;
            __1.DBService.retrievBlobMetaData.mockResolvedValue(mockedMetaData);
            s3_1.S3.getSignedURL.mockResolvedValue(null);
            axios_1.default.mockResolvedValue(null);
            const result = await s3Service.getBlob({
                id: 'test_id',
                user_id: 'test_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if get blob data failed with error throw', async () => {
            ;
            __1.DBService.retrievBlobMetaData.mockResolvedValue(mockedMetaData);
            s3_1.S3.getSignedURL.mockRejectedValue(null);
            axios_1.default.mockRejectedValue(null);
            const result = await s3Service.getBlob({
                id: 'test_id',
                user_id: 'test_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return data if all went okay', async () => {
            ;
            __1.DBService.retrievBlobMetaData.mockResolvedValue(mockedMetaData);
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: Buffer.from('testbase')
            });
            const s3Service = new AmazonS3Adapter_1.AmazonS3Adapter();
            const result = await s3Service.getBlob({
                id: 'test_id',
                user_id: 'test_id'
            });
            (0, vitest_1.expect)(result).toEqual(mockedMetaData);
        });
    });
    //NOTE: testing uploadBlobToS3
    (0, vitest_1.describe)('testing uploadBlobToS3', () => {
        (0, vitest_1.it)('should return upload url if all went okay', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: 'testbase'
            });
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.uploadBlobToS3({
                ...resultMocked,
                data: 'testbase'
            });
            (0, vitest_1.expect)(result).toEqual(mockS3Url);
        });
        (0, vitest_1.it)('should return null if the type is not in my list', async () => {
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.uploadBlobToS3({
                ...resultMocked,
                data: 'testbase',
                type: 'wrong_type'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if the url failed to get', async () => {
            ;
            s3_1.S3.getSignedURL.mockRejectedValue(null);
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.uploadBlobToS3({
                ...resultMocked,
                data: 'testbase',
                type: 'wrong_type'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if the url failed with error throw', async () => {
            ;
            s3_1.S3.getSignedURL.mockRejectedValue(null);
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.uploadBlobToS3({
                ...resultMocked,
                data: 'testbase',
                type: 'wrong_type'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if the axios failed with error throw', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockRejectedValue({ error: 'failed' });
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.uploadBlobToS3({
                ...resultMocked,
                data: 'testbase',
                type: 'wrong_type'
            });
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
    //NOTE: testing getBlobBuffer
    (0, vitest_1.describe)('testing getBlobBuffer', () => {
        (0, vitest_1.it)('should return buffer Data', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockResolvedValue({
                data: Buffer.from('testbase').toString('base64')
            });
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.getBlobBuffer({ id: 'test_id' });
            (0, vitest_1.expect)(result).toEqual(Buffer.from('testbase'));
        });
        (0, vitest_1.it)('should return null if getting signed url failed with null value', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue(null);
            axios_1.default.mockResolvedValue({});
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.getBlobBuffer({ id: 'test_id' });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if getting signed url failed with throw error', async () => {
            ;
            s3_1.S3.getSignedURL.mockRejectedValue(null);
            axios_1.default.mockResolvedValue({});
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.getBlobBuffer({ id: 'test_id' });
            (0, vitest_1.expect)(result).toBeNull();
        });
        (0, vitest_1.it)('should return null if axios failed', async () => {
            ;
            s3_1.S3.getSignedURL.mockResolvedValue('test_url');
            axios_1.default.mockRejectedValue(null);
            const result = await AmazonS3Adapter_1.AmazonS3Adapter.getBlobBuffer({ id: 'test_id' });
            (0, vitest_1.expect)(result).toBeNull();
        });
    });
});
