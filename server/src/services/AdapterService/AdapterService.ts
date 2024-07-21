import { StorageService } from '../index.types'
import {
  DBService,
  FTPService,
  LocalFileService,
  AmazonS3Adapter
} from '../storage'

export class AdapterService {
  adapter: StorageService

  constructor(adapter: StorageType) {
    this.adapterPicker(adapter)
  }

  adapterPicker(adapter: StorageType) {
    switch (adapter) {
      case StorageType.AMAZON_S3:
        this.adapter = new AmazonS3Adapter()
        break

      case StorageType.DATABASE:
        this.adapter = new DBService()
        break

      case StorageType.LOCAL:
        this.adapter = new LocalFileService()
        break
      case StorageType.FTP:
        this.adapter = new FTPService()
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
