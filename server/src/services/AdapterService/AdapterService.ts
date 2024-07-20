import { StorageService } from '../index.types'
import { DBService, S3Service } from '../storage'

export class AdapterService {
  adapter: StorageService

  constructor(adapter: StorageType) {
    this.adapterPicker(adapter)
  }

  adapterPicker(adapter: StorageType) {
    switch (adapter) {
      // case StorageType.DATABASE:
      //   this.adapter = new DBService()
      //   break

      case StorageType.AMAZON_S3:
        this.adapter = new S3Service()
        break

      default:
        break
    }
  }
}

export enum StorageType {
  AMAZON_S3 = 'AMAZON_S3',
  DATABASE = 'DATABASE',
  LOCAL = 'LOCAL',
  FTP = 'FTP'
}

export const adapterService = new AdapterService(StorageType.AMAZON_S3)
