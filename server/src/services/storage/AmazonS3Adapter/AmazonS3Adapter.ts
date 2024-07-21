import axios from 'axios'
import { BlobData, DBService, SaveBlob, StorageService } from '../..'
import { S3 } from '../../../utils/s3'
import { supportedFileTypes } from '../../../constants'
import { config } from '../../../config'
import { Blobs } from '../../../../prisma/generated/client'

/**
 * Configuration object for S3.
 */
export const s3 = {
    region: config.s3.region,
    endPoint: config.s3.endPoint,
    bucket: config.s3.bucket,
    accessKey: config.s3.accessKey,
    secretAccessKey: config.s3.secretAccessKey
}

const s3Endpoint = `${config.s3.endPoint}/${config.s3.bucket}`

/**
 * `AmazonS3Adapter` class implements the `StorageService` interface for interacting
 * with Amazon S3. It provides methods to save and retrieve blobs (files) to/from S3,
 * as well as handling related metadata using the `DBService`.
 */
export class AmazonS3Adapter implements StorageService {
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
    async saveBlob({
        id,
        name,
        type,
        data,
        size,
        user_id
    }: SaveBlob): Promise<Blobs | null> {
        try {
            // Upload the blob to S3 and get the public URL
            const s3blobUrl = await AmazonS3Adapter.uploadBlobToS3({
                user_id,
                data,
                type,
                name,
                id
            })
            if (!s3blobUrl) return null

            // Save blob metadata to the database
            const blob = await DBService.saveBlobMetaData({
                id,
                user_id: user_id as string,
                blob_url: s3blobUrl,
                blob_id: null,
                type,
                name,
                size: size!
            })
            if (!blob) return null

            return blob
        } catch (error) {
            return null
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
    async getBlob({
        id,
        user_id
    }: {
        id: string
        user_id: string
    }): Promise<BlobData | null> {
        try {
            // Retrieve blob metadata from the database
            const blobMetaData = await DBService.retrievBlobMetaData({
                id,
                user_id
            })

            if (!blobMetaData) return null

            // Retrieve the blob file from S3
            const data = await AmazonS3Adapter.getBlobBuffer({
                id: id + blobMetaData.name
            })
            if (!data) return null

            // Return combined blob metadata and data
            const blobData: BlobData = {
                ...blobMetaData,
                data: data
            }

            return blobData
        } catch (error) {
            return null
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
    static async uploadBlobToS3({
        id,
        name,
        type,
        data
    }: SaveBlob): Promise<string | null> {
        try {
            if (!supportedFileTypes.includes(type)) return null

            const buffer = Buffer.from(data, 'base64')
            const key = id + name

            const requestOptions = {
                method: 'PUT',
                url: `${s3Endpoint}/${key}`,
                headers: {
                    'Content-Type': 'application/octet-stream',
                    'Content-Length': buffer.length,
                    Host: new URL(config.s3.endPoint).hostname
                },
                data: buffer
            }

            const url = await S3.getSignedURL(requestOptions, s3)
            if (!url) return null

            await axios(requestOptions)

            const publicUrl = `${config.s3.endPointUrl}/${config.s3.bucket}/${id + name}`

            return publicUrl
        } catch (error) {
            return null
        }
    }

    /**
     * Retrieves the blob (file) data from Amazon S3 as a Buffer.
     *
     * @param {Object} params - Parameters for retrieving the blob.
     * @param {string} params.id - Unique identifier for the blob.
     * @returns {Promise<Buffer | null>} - Returns a promise that resolves to the blob data as a Buffer or null if an error occurs.
     */
    static async getBlobBuffer({ id }: { id: string }): Promise<Buffer | null> {
        try {
            const key = id
            const requestOptions = {
                method: 'GET',
                url: `${s3Endpoint}/${key}`,
                headers: {
                    Host: new URL(config.s3.endPoint).hostname
                }
            }

            const url = await S3.getSignedURL(requestOptions, s3)
            if (!url) return null

            const response = await axios(requestOptions)
            const data = Buffer.from(response.data, 'base64')

            return data
        } catch (error) {
            return null
        }
    }
}
