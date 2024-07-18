import { StorageType } from '../services/uploadAdapter'

export interface Blob {
  id: string
  size: number
  createdAt: Date
  storageType: StorageType
}
