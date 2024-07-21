import * as fs from 'fs'
import * as path from 'path'
import { StorageService } from '../../index.types'
import { SaveBlob } from '../../AdapterService'
import { Blobs } from '@prisma/client'
import { BlobData } from '../AmazonS3Adapter'
import { DBService } from '../DatabaseAdapter'

export class LocalFileService implements StorageService {
  private storagePath: string
  constructor() {
    this.storagePath = path.join(__dirname, '../../../../', 'uploads')
    this.ensureDirectoryExists(this.storagePath)
  }
  private ensureDirectoryExists(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  }

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
      await fs.promises.writeFile(filePath, data)

      //NOTE: Save metadata to the database
      const blob = await DBService.saveBlobMetaData({
        id,
        user_id,
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

  async getBlob({
    id,
    user_id
  }: {
    id: string
    user_id: string
  }): Promise<BlobData | null> {
    const filePath = path.join(this.storagePath, id)

    try {
      const data = await fs.promises.readFile(filePath)
      if (!data) return null

      const blobMetaData = await DBService.retrievBlobMetaData({
        id,
        user_id
      })
      if (!blobMetaData) return null

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
