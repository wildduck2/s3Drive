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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalFileService = void 0;
const fs = __importStar(require("fs"));
const path_1 = __importDefault(require("path"));
const __1 = require("../..");
/**
 * `LocalFileService` class implements the `StorageService` interface for managing blobs
 * stored on the local file system. This class handles the saving and retrieval of files
 * and ensures the storage directory is properly set up.
 */
class LocalFileService {
    storagePath;
    /**
     * Constructs an instance of `LocalFileService` and sets up the storage directory.
     * The constructor ensures the directory exists where files will be stored.
     */
    constructor() {
        this.storagePath = path_1.default.join(__dirname, '../../../../', 'uploads');
        this.ensureDirectoryExists(this.storagePath);
    }
    /**
     * Checks if the specified directory exists. If not, it creates the directory
     * and any necessary parent directories.
     *
     * @param {string} dir - The path of the directory to check and create if necessary.
     */
    ensureDirectoryExists(dir) {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
    }
    /**
     * Saves a blob (file) to the local file system and its metadata to the database.
     *
     * @param {SaveBlob} blobData - An object containing the details of the blob to save.
     * @param {string} blobData.id - Unique identifier for the blob.
     * @param {string} blobData.name - Name of the blob file.
     * @param {string} blobData.type - MIME type of the blob file.
     * @param {string} blobData.data - Base64-encoded data of the blob file.
     * @param {string} blobData.size - Size of the blob file.
     * @param {string} blobData.user_id - User ID associated with the blob.
     * @returns {Promise<Blobs | null>} - Returns a promise that resolves to the saved blob metadata
     * or null if an error occurs.
     */
    async saveBlob({ id, name, type, data, size, user_id }) {
        const filePath = path_1.default.join(this.storagePath, id);
        try {
            // Save the blob data to the local file system
            await fs.promises.writeFile(filePath, data);
            // Save metadata to the database
            const blob = await __1.DBService.saveBlobMetaData({
                id,
                user_id: user_id,
                type,
                name,
                size: size,
                blob_url: '',
                blob_id: null
            });
            if (!blob)
                return null;
            return blob;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Retrieves a blob (file) from the local file system and its metadata from the database.
     *
     * @param {Object} params - Parameters for retrieving the blob.
     * @param {string} params.id - Unique identifier for the blob.
     * @param {string} params.user_id - User ID associated with the blob.
     * @returns {Promise<BlobData | null>} - Returns a promise that resolves to the blob data
     * and metadata or null if an error occurs.
     */
    async getBlob({ id, user_id }) {
        const filePath = path_1.default.join(this.storagePath, id);
        try {
            // Read the blob data from the local file system
            const data = await fs.promises.readFile(filePath);
            if (!data)
                return null;
            // Retrieve blob metadata from the database
            const blobMetaData = await __1.DBService.retrievBlobMetaData({
                id,
                user_id
            });
            if (!blobMetaData)
                return null;
            // Return the blob data and metadata
            const blobData = {
                ...blobMetaData,
                data: data
            };
            return blobData;
        }
        catch (error) {
            return null;
        }
    }
}
exports.LocalFileService = LocalFileService;
