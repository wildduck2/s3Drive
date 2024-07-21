"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmazonS3Adapter = exports.s3 = void 0;
const axios_1 = __importDefault(require("axios"));
const __1 = require("../..");
const s3_1 = require("../../../utils/s3");
const constants_1 = require("../../../constants");
const config_1 = require("../../../config");
/**
 * Configuration object for S3.
 */
exports.s3 = {
    region: config_1.config.s3.region,
    endPoint: config_1.config.s3.endPoint,
    bucket: config_1.config.s3.bucket,
    accessKey: config_1.config.s3.accessKey,
    secretAccessKey: config_1.config.s3.secretAccessKey
};
const s3Endpoint = `${config_1.config.s3.endPoint}/${config_1.config.s3.bucket}`;
/**
 * `AmazonS3Adapter` class implements the `StorageService` interface for interacting
 * with Amazon S3. It provides methods to save and retrieve blobs (files) to/from S3,
 * as well as handling related metadata using the `DBService`.
 */
class AmazonS3Adapter {
    /**
     * Saves a blob (file) to Amazon S3 and metadata to the database.
     *
     * @param {SaveBlob} blobData - An object containing the details of the blob to save.
     * @param {string} blobData.id - Unique identifier for the blob.
     * @param {string} blobData.name - Name of the blob file.
     * @param {string} blobData.type - MIME type of the blob file.
     * @param {string} blobData.data - Base64-encoded data of the blob file.
     * @param {string} blobData.size - Size of the blob file.
     * @param {string} blobData.user_id - User ID associated with the blob.
     * @returns {Promise<Blobs | null>} - Returns a promise that resolves to the metadata of the saved blob or null if an error occurs.
     */
    async saveBlob({ id, name, type, data, size, user_id }) {
        try {
            // Upload the blob to S3 and get the public URL
            const s3blobUrl = await AmazonS3Adapter.uploadBlobToS3({
                user_id,
                data,
                type,
                name,
                id
            });
            if (!s3blobUrl)
                return null;
            // Save blob metadata to the database
            const blob = await __1.DBService.saveBlobMetaData({
                id,
                user_id: user_id,
                blob_url: s3blobUrl,
                blob_id: null,
                type,
                name,
                size: size
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
     * Retrieves a blob (file) from Amazon S3 and its metadata from the database.
     *
     * @param {Object} params - Parameters for retrieving the blob.
     * @param {string} params.id - Unique identifier for the blob.
     * @param {string} params.user_id - User ID associated with the blob.
     * @returns {Promise<BlobData | null>} - Returns a promise that resolves to the blob data and metadata or null if an error occurs.
     */
    async getBlob({ id, user_id }) {
        try {
            // Retrieve blob metadata from the database
            const blobMetaData = await __1.DBService.retrievBlobMetaData({
                id,
                user_id
            });
            if (!blobMetaData)
                return null;
            // Retrieve the blob file from S3
            const data = await AmazonS3Adapter.getBlobBuffer({
                id: id + blobMetaData.name
            });
            if (!data)
                return null;
            // Return combined blob metadata and data
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
    /**
     * Uploads a blob (file) to Amazon S3 and returns the public URL of the uploaded file.
     *
     * @param {SaveBlob} blobData - An object containing the details of the blob to upload.
     * @param {string} blobData.id - Unique identifier for the blob.
     * @param {string} blobData.name - Name of the blob file.
     * @param {string} blobData.type - MIME type of the blob file.
     * @param {string} blobData.data - Base64-encoded data of the blob file.
     * @returns {Promise<string | null>} - Returns a promise that resolves to the public URL of the uploaded blob or null if an error occurs.
     */
    static async uploadBlobToS3({ id, name, type, data }) {
        try {
            if (!constants_1.supportedFileTypes.includes(type))
                return null;
            const buffer = Buffer.from(data, 'base64');
            const key = id + name;
            const requestOptions = {
                method: 'PUT',
                url: `${s3Endpoint}/${key}`,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': buffer.length,
                    Host: new URL(config_1.config.s3.endPoint).hostname
                },
                data: buffer
            };
            const url = await s3_1.S3.getSignedURL(requestOptions, exports.s3);
            if (!url)
                return null;
            await (0, axios_1.default)(requestOptions);
            const publicUrl = `${config_1.config.s3.endPointUrl}/${config_1.config.s3.bucket}/${id + name}`;
            return publicUrl;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Retrieves the blob (file) data from Amazon S3 as a Buffer.
     *
     * @param {Object} params - Parameters for retrieving the blob.
     * @param {string} params.id - Unique identifier for the blob.
     * @returns {Promise<Buffer | null>} - Returns a promise that resolves to the blob data as a Buffer or null if an error occurs.
     */
    static async getBlobBuffer({ id }) {
        try {
            const key = id;
            const requestOptions = {
                method: 'GET',
                url: `${s3Endpoint}/${key}`,
                headers: {
                    Host: new URL(config_1.config.s3.endPoint).hostname
                }
            };
            const url = await s3_1.S3.getSignedURL(requestOptions, exports.s3);
            if (!url)
                return null;
            const response = await (0, axios_1.default)(requestOptions);
            const data = Buffer.from(response.data, 'base64');
            return data;
        }
        catch (error) {
            return null;
        }
    }
}
exports.AmazonS3Adapter = AmazonS3Adapter;
