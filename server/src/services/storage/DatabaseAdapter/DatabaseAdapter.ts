import { BlobData, SaveBlob } from '../..'
import { StorageService } from '../../index.types'
import {
    ListBlobsMetaDataType,
    PaginationType,
    RetrievBlobMetaDataType,
    saveBlobMetaDataType
} from './DatabaseAdapter.types'
import { prisma } from '../../../utils'
import { Blobs } from '../../../../prisma/generated/client'

/**
 * `DBService` class implements the `StorageService` interface for database operations related
 * to blobs and their metadata. It uses Prisma to interact with the database.
 */
export class DBService implements StorageService {
    /**
     * Saves a blob (file) and its metadata to the database.
     *
     * @param {SaveBlob} blobData - An object containing the details of the blob to save.
     * @param {string} blobData.id - Unique identifier for the blob.
     * @param {string} blobData.name - Name of the blob file.
     * @param {string} blobData.size - Size of the blob file.
     * @param {string} blobData.type - MIME type of the blob file.
     * @param {string} blobData.data - Base64-encoded data of the blob file.
     * @param {string} blobData.user_id - User ID associated with the blob.
     * @returns {Promise<BlobData | null>} - Returns a promise that resolves to the blob data and metadata or null if an error occurs.
     */
    async saveBlob({
        id,
        name,
        size,
        type,
        data,
        user_id
    }: SaveBlob): Promise<BlobData | null> {
        try {
            // Save the blob data to the database
            const blobData = await prisma.blob.create({
                data: {
                    id,
                    data: Buffer.from(data, 'base64')
                }
            })
            if (!blobData) return null

            // Save blob metadata to the database
            const blob = await DBService.saveBlobMetaData({
                id,
                user_id: user_id as string,
                type,
                name,
                size: size!,
                blob_url: '',
                blob_id: blobData.id
            })
            if (!blob) return null

            return blob
        } catch (error) {
            return null
        }
    }

    /**
     * Retrieves a blob (file) and its metadata from the database.
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

            // Return blob metadata
            const blobData = {
                ...blobMetaData
            }
            return blobData
        } catch (error) {
            return null
        }
    }

    /**
     * Saves metadata for a blob (file) to the database.
     *
     * @param {saveBlobMetaDataType} metaData - Metadata to be saved.
     * @param {string} metaData.id - Unique identifier for the blob.
     * @param {string} metaData.user_id - User ID associated with the blob.
     * @param {string} metaData.blob_url - URL of the blob.
     * @param {string} metaData.blob_id - Database identifier for the blob.
     * @param {string} metaData.size - Size of the blob file.
     * @param {string} metaData.name - Name of the blob file.
     * @param {string} metaData.type - MIME type of the blob file.
     * @returns {Promise<Blobs | null>} - Returns a promise that resolves to the saved blob metadata or null if an error occurs.
     */
    static async saveBlobMetaData({
        id,
        user_id,
        blob_url,
        blob_id,
        size,
        name,
        type
    }: saveBlobMetaDataType): Promise<Blobs | null> {
        try {
            // Save blob metadata to the database
            const blob = await prisma.blobs.create({
                data: {
                    id,
                    name,
                    type,
                    size,
                    user_id,
                    blob_id,
                    blob_url
                }
            })
            if (!blob) return null

            return blob
        } catch (error) {
            return null
        }
    }

    /**
     * Retrieves metadata for a blob (file) from the database.
     *
     * @param {RetrievBlobMetaDataType} params - Parameters for retrieving the blob metadata.
     * @param {string} params.id - Unique identifier for the blob.
     * @param {string} params.user_id - User ID associated with the blob.
     * @returns {Promise<BlobData | null>} - Returns a promise that resolves to the blob metadata or null if an error occurs.
     */
    static async retrievBlobMetaData({
        id,
        user_id
    }: RetrievBlobMetaDataType): Promise<
        | ({
            Blob: {
                data: Buffer
            } | null
        } & BlobData)
        | null
    > {
        try {
            // Retrieve blob metadata from the database
            const blob = await prisma.blobs.findUnique({
                where: {
                    id,
                    user_id
                },
                include: {
                    Blob: {
                        select: {
                            data: true
                        }
                    }
                }
            })
            if (!blob) return null

            return blob
        } catch (error) {
            return null
        }
    }

    /**
     * Lists metadata for blobs with pagination support.
     *
     * @param {ListBlobsMetaDataType} params - Parameters for listing blob metadata.
     * @param {number} params.page - Current page number for pagination.
     * @param {number} params.pageSize - Number of items per page.
     * @returns {Promise<{ blobs: Blobs[]; pagination: PaginationType } | null>} - Returns a promise that resolves to the list of blobs and pagination information or null if an error occurs.
     */
    static async listBlobsMetaData({
        page,
        pageSize
    }: ListBlobsMetaDataType): Promise<{
        blobs: Blobs[]
        pagination: PaginationType
    } | null> {
        try {
            const skip = (+page - 1) * +pageSize
            const blobs = await prisma.blobs.findMany({
                skip: skip,
                take: +pageSize,
                orderBy: {
                    createdAt: 'desc'
                }
            })

            const totalCount = await prisma.blobs.count()
            const totalPages = Math.ceil(totalCount / +pageSize)

            return {
                blobs,
                pagination: {
                    page: +page,
                    nextPage: +page < +totalPages ? +page + 1 : null,
                    prevPage: +page > 1 ? +page - 1 : null,
                    pageSize: +pageSize,
                    totalCount,
                    totalPages: Math.ceil(totalCount / +pageSize)
                }
            }
        } catch (error) {
            return null
        }
    }
}
