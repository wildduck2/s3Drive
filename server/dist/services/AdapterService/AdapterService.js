"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StorageType = exports.AdapterService = void 0;
const storage_1 = require("../storage");
/**
 * `AdapterService` class is responsible for selecting and initializing
 * the appropriate storage service based on the specified storage type.
 *
 * It implements the `StorageService` interface and provides a mechanism
 * to interact with various storage adapters like Amazon S3, Database,
 * Local File System, and FTP.
 */
class AdapterService {
    /**
     * The selected storage adapter instance.
     * Implements the `StorageService` interface.
     */
    // @ts-expect-error-error adapter
    adapter;
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
    constructor(adapter) {
        this.adapterPicker(adapter);
    }
    /**
     * Selects and initializes the appropriate storage adapter based on the provided storage type.
     *
     * @param adapter - The type of storage adapter to initialize. Must be one of the `StorageType` enum values.
     */
    adapterPicker(adapter) {
        switch (adapter) {
            case StorageType.AMAZON_S3:
                this.adapter = new storage_1.AmazonS3Adapter();
                break;
            case StorageType.DATABASE:
                this.adapter = new storage_1.DBService();
                break;
            case StorageType.LOCAL:
                this.adapter = new storage_1.LocalFileService();
                break;
            // case StorageType.FTP:
            //   this.adapter = new FTPService()
            //   break
            default:
                throw new Error(`Unsupported storage type: ${adapter}`);
        }
    }
}
exports.AdapterService = AdapterService;
/**
 * Enum representing the different types of storage services supported by the `AdapterService`.
 * Each value corresponds to a specific storage adapter.
 */
var StorageType;
(function (StorageType) {
    StorageType["AMAZON_S3"] = "AMAZON_S3";
    StorageType["DATABASE"] = "DATABASE";
    StorageType["LOCAL"] = "LOCAL";
    StorageType["FTP"] = "FTP";
})(StorageType || (exports.StorageType = StorageType = {}));
