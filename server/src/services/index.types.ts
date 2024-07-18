import { Blob } from '@prisma/client'
import { SaveBlob } from './AdapterService'

export interface StorageService {
  saveBlob({ id, name, size, type, data }: SaveBlob): Promise<Blob | null>
  getBlob(id: string): Promise<Buffer>
}
