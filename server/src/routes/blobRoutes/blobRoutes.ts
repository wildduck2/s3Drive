import { Router } from 'express'
import { authMiddleware } from '../../middlewares'
import { BlobController } from '../../controllers'
import { adapterService } from '../../services'

const router = Router()

const blobController = new BlobController(adapterService)
router.put('/v1/blobs', authMiddleware, (req, res) => {
  blobController.storeBlob(req, res)
})

router.get('/v1/blobs/:id', authMiddleware, (req, res) =>
  blobController.retrieveBlob(req, res)
)

router.get('/v1/blobs', authMiddleware, (req, res) =>
  blobController.listBucketBlobs(req, res)
)

export { router as blobRoutes }
