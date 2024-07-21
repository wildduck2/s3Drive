import { StorageType } from '../services'

export interface Blob {
  id: string
  size: number
  createdAt: Date
  storageType: StorageType
}
