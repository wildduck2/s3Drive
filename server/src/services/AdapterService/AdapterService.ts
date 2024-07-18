import { StorageService } from '../index.types'
import { DBService, S3Service } from '../storage'

export class AdapterService {
    adapter: StorageService

    constructor(adapter: StorageType) {
        this.adapterPicker(adapter)
    }

    adapterPicker(adapter: StorageType) {
        switch (adapter) {
            case StorageType.DATABASE:
                this.adapter = new DBService()
                break

            default:
                break
        }
    }
}

export enum StorageType {
    DATABASE = 'DATABASE',
    LOCAL = 'LOCAL',
    FTP = 'FTP'
}

export const adapterService = new AdapterService(StorageType.DATABASE)
