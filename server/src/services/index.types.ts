import { Blobs } from '@prisma/client'
import { SaveBlob } from './AdapterService'
import { BlobData } from './storage'

export interface StorageService {
  saveBlob({
    id,
    name,
    type,
    data,
    size,
    user_id
  }: SaveBlob): Promise<Blobs | null>
  getBlob({
    id,
    user_id
  }: {
    id: string
    user_id: string
  }): Promise<BlobData | null>
}
