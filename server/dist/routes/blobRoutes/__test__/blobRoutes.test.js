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
const services_1 = require("../../../services");
const DatabaseAdapter_1 = require("../../../services/storage/DatabaseAdapter");
// Mock fs and DBService
vitest_1.vi.mock('fs', () => ({
    promises: {
        writeFile: vitest_1.vi.fn(),
        readFile: vitest_1.vi.fn()
    },
    existsSync: vitest_1.vi.fn(),
    mkdirSync: vitest_1.vi.fn()
}));
// Mock DBService methods
vitest_1.vi.mock('../../../services/storage/DatabaseAdapter', () => ({
    DBService: {
        saveBlobMetaData: vitest_1.vi.fn(),
        retrievBlobMetaData: vitest_1.vi.fn() // Ensure this is a function
    }
}));
const LocalFileServiceInstance = new services_1.LocalFileService();
(0, vitest_1.describe)('LocalFileService', () => {
    const blobMetaDataMock = {
        id: 'test_id',
        name: 'file.txt',
        type: 'image/png',
        size: '123',
        user_id: 'test_user_id',
        blob_url: '',
        blob_id: null,
        createdAt: new Date() // Using a real date object here for consistency
    };
    (0, vitest_1.describe)('getBlob', () => {
        (0, vitest_1.it)('should retrieve the blob and metadata successfully', async () => {
            const buffer = Buffer.from('testdata');
            fs.promises.readFile.mockResolvedValue(buffer);
            DatabaseAdapter_1.DBService.retrievBlobMetaData.mockResolvedValue({
                ...blobMetaDataMock,
                Blob: {
                    data: buffer
                }
            });
            const result = await LocalFileServiceInstance.getBlob({
                id: 'test_id',
                user_id: 'test_user_id'
            });
            (0, vitest_1.expect)(result).toEqual({
                ...blobMetaDataMock,
                Blob: { data: buffer },
                data: buffer
            });
            (0, vitest_1.expect)(fs.promises.readFile).toHaveBeenCalledWith(path.join(__dirname, '../../../../', 'uploads', 'test_id'));
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
        });
    });
});
