"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blobRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const controllers_1 = require("../../controllers");
const services_1 = require("../../services");
// Create a new Express Router instance
const router = (0, express_1.Router)();
exports.blobRoutes = router;
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
router.put('/v1/blobs', middlewares_1.authMiddleware, (req, res) => {
    // Create an instance of AdapterService with the selected storage adapter
    const adapterService = new services_1.AdapterService(req.body.adapter);
    // Create an instance of BlobController with the adapter service
    const blobController = new controllers_1.BlobController(adapterService);
    // Call the `storeBlob` method to handle storing the blob
    blobController.storeBlob(req, res);
});
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
router.get('/v1/blobs/:id', middlewares_1.authMiddleware, (req, res) => {
    // Create an instance of AdapterService with the selected storage adapter
    const adapterService = new services_1.AdapterService(services_1.StorageType.LOCAL);
    // Create an instance of BlobController with the adapter service
    const blobController = new controllers_1.BlobController(adapterService);
    // Call the `retrieveBlob` method to handle retrieving the blob
    blobController.retrieveBlob(req, res);
});
/**
 * Route for listing all blobs.
 *
 * @route GET /v1/blobs
 * @param {string} req.body.adapter - The type of storage adapter to use (e.g., AMAZON_S3, DATABASE).
 * @param {Object} res - The response object to send back the result.
 * @middlewares authMiddleware - Middleware for authentication to ensure the user is authorized.
 * @controller BlobController - Handles listing blobs via the `listBucketBlobs` method.
 */
router.get('/v1/blobs', middlewares_1.authMiddleware, (req, res) => {
    // Create an instance of AdapterService with the selected storage adapter
    const adapterService = new services_1.AdapterService(req.query.adapter);
    // Create an instance of BlobController with the adapter service
    const blobController = new controllers_1.BlobController(adapterService);
    // Call the `listBucketBlobs` method to handle listing all blobs
    blobController.listBucketBlobs(req, res);
});
