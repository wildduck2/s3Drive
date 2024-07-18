import * as fs from 'fs'
import * as path from 'path'
import { StorageService } from '../../index.types'

export class LocalFileService implements StorageService {
  private storagePath: string

  constructor(storagePath: string) {
    this.storagePath = storagePath
  }

  async saveBlob(id: string, data: string): Promise<void> {
    const filePath = path.join(this.storagePath, id)
    await fs.promises.writeFile(filePath, data)
  }

  async getBlob(id: string): Promise<Buffer> {
    const filePath = path.join(this.storagePath, id)
    return await fs.promises.readFile(filePath)
  }
}
