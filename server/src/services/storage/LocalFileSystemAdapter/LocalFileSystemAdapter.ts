import fs from 'fs'
import path from 'path'
import { BlobData, DBService, SaveBlob, StorageService } from '../..'
import { Blobs } from '../../../../prisma/generated/client'

/**
 * `LocalFileService` class implements the `StorageService` interface for managing blobs
 * stored on the local file system. This class handles the saving and retrieval of files
 * and ensures the storage directory is properly set up.
 */
export class LocalFileService implements StorageService {
  private storagePath: string

  /**
   * Constructs an instance of `LocalFileService` and sets up the storage directory.
   * The constructor ensures the directory exists where files will be stored.
   */
  constructor() {
    this.storagePath = path.join(__dirname, '../../../../', 'uploads')
    this.ensureDirectoryExists(this.storagePath)
  }

  /**
   * Checks if the specified directory exists. If not, it creates the directory
   * and any necessary parent directories.
   *
   * @param {string} dir - The path of the directory to check and create if necessary.
   */
  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
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
  async saveBlob({
    id,
    name,
    type,
    data,
    size,
    user_id
  }: SaveBlob): Promise<Blobs | null> {
    const filePath = path.join(this.storagePath, id)

    try {
      // Save the blob data to the local file system
      await fs.promises.writeFile(filePath, data)

      // Save metadata to the database
      const blob = await DBService.saveBlobMetaData({
        id,
        user_id: user_id as string,
        type,
        name,
        size: size!,
        blob_url: '',
        blob_id: null
      })
      if (!blob) return null

      return blob
    } catch (error) {
      return null
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
  async getBlob({
    id,
    user_id
  }: {
    id: string
    user_id: string
  }): Promise<BlobData | null> {
    const filePath = path.join(this.storagePath, id)

    try {
      // Read the blob data from the local file system
      const data = await fs.promises.readFile(filePath)
      if (!data) return null

      // Retrieve blob metadata from the database
      const blobMetaData = await DBService.retrievBlobMetaData({
        id,
        user_id
      })
      if (!blobMetaData) return null

      // Return the blob data and metadata
      const blobData: BlobData = {
        ...blobMetaData,
        data: data
      }
      return blobData
    } catch (error) {
      return null
    }
  }
}
