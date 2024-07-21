"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const vitest_1 = require("vitest");
const LocalFileSystemAdapter_1 = require("../LocalFileSystemAdapter");
const DatabaseAdapter_1 = require("../../DatabaseAdapter");
// Mock fs and DBService
vitest_1.vi.mock('fs', () => ({
    promises: {
        writeFile: vitest_1.vi.fn(),
        readFile: vitest_1.vi.fn()
    },
    existsSync: vitest_1.vi.fn(),
    mkdirSync: vitest_1.vi.fn()
}));
vitest_1.vi.mock('../../DatabaseAdapter', () => ({
    DBService: {
        saveBlobMetaData: vitest_1.vi.fn(),
        retrievBlobMetaData: vitest_1.vi.fn()
    }
}));
const LocalFileServiceInstance = new LocalFileSystemAdapter_1.LocalFileService();
(0, vitest_1.describe)('LocalFileService', () => {
    const blobMock = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        data: 'testdata',
        size: '123',
        user_id: 'test_user_id'
    };
    const blobMetaDataMock = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        size: '123',
        user_id: 'test_user_id',
        blob_url: '',
        blob_id: null,
        createdAt: vitest_1.expect.any(Date)
    };
    (0, vitest_1.describe)('saveBlob', () => {
        (0, vitest_1.it)('should save the blob and metadata successfully', async () => {
            ;
            fs.promises.writeFile.mockResolvedValue(undefined);
            DatabaseAdapter_1.DBService.saveBlobMetaData.mockResolvedValue(blobMetaDataMock);
            const result = await LocalFileServiceInstance.saveBlob(blobMock);
            (0, vitest_1.expect)(result).toEqual(blobMetaDataMock);
            (0, vitest_1.expect)(fs.promises.writeFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', blobMock.id), blobMock.data);
            (0, vitest_1.expect)(DatabaseAdapter_1.DBService.saveBlobMetaData).toHaveBeenCalledWith({
                id: blobMock.id,
                user_id: blobMock.user_id,
                type: blobMock.type,
                name: blobMock.name,
                size: blobMock.size,
                blob_url: '',
                blob_id: null
            });
        });
        (0, vitest_1.it)('should return null if saving the file fails', async () => {
            ;
            fs.promises.writeFile.mockRejectedValue(new Error('Failed to save file'));
            const result = await LocalFileServiceInstance.saveBlob(blobMock);
            (0, vitest_1.expect)(result).toBeNull();
            (0, vitest_1.expect)(fs.promises.writeFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', blobMock.id), blobMock.data);
        });
        (0, vitest_1.it)('should return null if saving metadata fails', async () => {
            ;
            fs.promises.writeFile.mockResolvedValue(undefined);
            DatabaseAdapter_1.DBService.saveBlobMetaData.mockResolvedValue(null);
            const result = await LocalFileServiceInstance.saveBlob(blobMock);
            (0, vitest_1.expect)(result).toBeNull();
            (0, vitest_1.expect)(fs.promises.writeFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', blobMock.id), blobMock.data);
        });
    });
    (0, vitest_1.describe)('getBlob', () => {
        (0, vitest_1.it)('should retrieve the blob and metadata successfully', async () => {
            ;
            fs.promises.readFile.mockResolvedValue(Buffer.from('testdata'));
            DatabaseAdapter_1.DBService.retrievBlobMetaData.mockResolvedValue({
                ...blobMetaDataMock,
                Blob: {
                    data: Buffer.from('testdata')
                }
            });
            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toEqual({
                ...blobMetaDataMock,
                Blob: { data: Buffer.from('testdata') },
                data: Buffer.from('testdata')
            });
            (0, vitest_1.expect)(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', 'test_id'));
            (0, vitest_1.expect)(DatabaseAdapter_1.DBService.retrievBlobMetaData).toHaveBeenCalledWith({
                id: 'test_id',
                user_id: 'test_user_id'
            });
        });
        (0, vitest_1.it)('should return null if reading the file fails', async () => {
            ;
            fs.promises.readFile.mockRejectedValue(new Error('Failed to read file'));
            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
            (0, vitest_1.expect)(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', 'test_id'));
        });
        (0, vitest_1.it)('should return null if retrieving metadata fails', async () => {
            ;
            fs.promises.readFile.mockResolvedValue(Buffer.from('testdata'));
            DatabaseAdapter_1.DBService.retrievBlobMetaData.mockResolvedValue(null);
            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toBeNull();
            (0, vitest_1.expect)(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../../', 'uploads', 'test_id'));
        });
    });
});
