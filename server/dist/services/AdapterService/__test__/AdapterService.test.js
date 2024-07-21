"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const AdapterService_1 = require("../AdapterService");
const storage_1 = require("../../storage");
// Mock the service classes
vitest_1.vi.mock('../storage', () => ({
    DBService: vitest_1.vi.fn().mockImplementation(() => ({})),
    FTPService: vitest_1.vi.fn().mockImplementation(() => ({})),
    LocalFileService: vitest_1.vi.fn().mockImplementation(() => ({})),
    S3Service: vitest_1.vi.fn().mockImplementation(() => ({}))
}));
(0, vitest_1.describe)('AdapterService', () => {
    (0, vitest_1.it)('should initialize S3Service for AMAZON_S3 storage type', () => {
        const service = new AdapterService_1.AdapterService(AdapterService_1.StorageType.AMAZON_S3);
        (0, vitest_1.expect)(service.adapter).toBeInstanceOf(storage_1.AmazonS3Adapter);
    });
    (0, vitest_1.it)('should initialize DBService for DATABASE storage type', () => {
        const service = new AdapterService_1.AdapterService(AdapterService_1.StorageType.DATABASE);
        (0, vitest_1.expect)(service.adapter).toBeInstanceOf(storage_1.DBService);
    });
    (0, vitest_1.it)('should initialize LocalFileService for LOCAL storage type', () => {
        const service = new AdapterService_1.AdapterService(AdapterService_1.StorageType.LOCAL);
        (0, vitest_1.expect)(service.adapter).toBeInstanceOf(storage_1.LocalFileService);
    });
    (0, vitest_1.it)('should initialize FTPService for FTP storage type', () => {
        const service = new AdapterService_1.AdapterService(AdapterService_1.StorageType.FTP);
        (0, vitest_1.expect)(service.adapter).toBeInstanceOf(storage_1.FTPService);
    });
    (0, vitest_1.it)('should not initialize any service for an invalid storage type', () => {
        // Here we assume that no service will be initialized for an invalid storage type
        const invalidStorageType = 'INVALID_TYPE';
        const service = new AdapterService_1.AdapterService(invalidStorageType);
        (0, vitest_1.expect)(service.adapter).toBeUndefined();
    });
});
