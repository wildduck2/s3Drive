import { StorageService } from '../index.types'
import { DBService, LocalFileService, AmazonS3Adapter } from '../storage'

/**
 * `AdapterService` class is responsible for selecting and initializing
 * the appropriate storage service based on the specified storage type.
 *
 * It implements the `StorageService` interface and provides a mechanism
 * to interact with various storage adapters like Amazon S3, Database,
 * Local File System, and FTP.
 */
export class AdapterService {
    /**
     * The selected storage adapter instance.
     * Implements the `StorageService` interface.
     */
    // @ts-expect-error-error adapter
    adapter: StorageService | null
    /**
     * Creates an instance of `AdapterService`.
     * Initializes the appropriate storage adapter based on the provided storage type.
     *
     * @param adapter - The type of storage adapter to initialize. Must be one of the `StorageType` enum values.
     */

    /**
     * Creates an instance of `AdapterService`.
     * Initializes the appropriate storage adapter based on the provided storage type.
     *
     * @param adapter - The type of storage adapter to initialize. Must be one of the `StorageType` enum values.
     */
    constructor(adapter: StorageType) {
        this.adapterPicker(adapter)
    }

    /**
     * Selects and initializes the appropriate storage adapter based on the provided storage type.
     *
     * @param adapter - The type of storage adapter to initialize. Must be one of the `StorageType` enum values.
     */
    private adapterPicker(adapter: StorageType) {
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

            // case StorageType.FTP:
            //   this.adapter = new FTPService()
            //   break

            default:
                break
        }
    }
}

/**
 * Enum representing the different types of storage services supported by the `AdapterService`.
 * Each value corresponds to a specific storage adapter.
 */
export enum StorageType {
    AMAZON_S3 = 'AMAZON_S3',
    DATABASE = 'DATABASE',
    LOCAL = 'LOCAL',
    FTP = 'FTP'
}
