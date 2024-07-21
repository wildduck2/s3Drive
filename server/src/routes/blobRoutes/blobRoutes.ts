import { Router } from 'express'
import { authMiddleware } from '../../middlewares'
import { BlobController } from '../../controllers'
import { AdapterService, StorageType } from '../../services'

// Create a new Express Router instance
const router = Router()

/**
 * Route for storing a blob.
 *
 * @route PUT /v1/blobs
 * @param {string} req.body.adapter - The type of storage adapter to use (e.g., AMAZON_S3, DATABASE).
 * @param {Object} req.body - The body of the request should contain blob details.
 * @param {Object} res - The response object to send back the result.
 * @middlewares authMiddleware - Middleware for authentication to ensure the user is authorized.
 * @controller BlobController - Handles the storage of blobs via the `storeBlob` method.
 */
router.put('/v1/blobs', authMiddleware, (req, res) => {
  // Create an instance of AdapterService with the selected storage adapter
  const adapterService = new AdapterService(req.body.adapter)

  // Create an instance of BlobController with the adapter service
  const blobController = new BlobController(adapterService)

  // Call the `storeBlob` method to handle storing the blob
  blobController.storeBlob(req, res)
})

/**
 * Route for retrieving a blob.
 *
 * @route GET /v1/blobs/:id
 * @param {string} req.params.id - The unique identifier of the blob to retrieve.
 * @param {string} req.body.adapter - The type of storage adapter to use (e.g., AMAZON_S3, DATABASE).
 * @param {Object} res - The response object to send back the result.
 * @middlewares authMiddleware - Middleware for authentication to ensure the user is authorized.
 * @controller BlobController - Handles the retrieval of blobs via the `retrieveBlob` method.
 */
router.get('/v1/blobs/:id', authMiddleware, (req, res) => {
  // Create an instance of AdapterService with the selected storage adapter
  const adapterService = new AdapterService(StorageType.LOCAL)

  // Create an instance of BlobController with the adapter service
  const blobController = new BlobController(adapterService)

  // Call the `retrieveBlob` method to handle retrieving the blob
  blobController.retrieveBlob(req, res)
})

/**
 * Route for listing all blobs.
 *
 * @route GET /v1/blobs
 * @param {string} req.body.adapter - The type of storage adapter to use (e.g., AMAZON_S3, DATABASE).
 * @param {Object} res - The response object to send back the result.
 * @middlewares authMiddleware - Middleware for authentication to ensure the user is authorized.
 * @controller BlobController - Handles listing blobs via the `listBucketBlobs` method.
 */
router.get('/v1/blobs', authMiddleware, (req, res) => {
  // Create an instance of AdapterService with the selected storage adapter
  const adapterService = new AdapterService(req.query.adapter as StorageType)

  // Create an instance of BlobController with the adapter service
  const blobController = new BlobController(adapterService)

  // Call the `listBucketBlobs` method to handle listing all blobs
  blobController.listBucketBlobs(req, res)
})

// Export the router instance for use in other parts of the application
export { router as blobRoutes }
