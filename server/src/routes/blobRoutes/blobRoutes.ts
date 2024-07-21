import { Router } from 'express'
import { authMiddleware } from '../../middlewares'
import { BlobController } from '../../controllers'
import { AdapterService } from '../../services'

const router = Router()

router.put('/v1/blobs', authMiddleware, (req, res) => {
  const adapterService = new AdapterService(req.body.adapter)
  const blobController = new BlobController(adapterService)
  blobController.storeBlob(req, res)
})

router.get('/v1/blobs/:id', authMiddleware, (req, res) => {
  const adapterService = new AdapterService(req.body.adapter)
  const blobController = new BlobController(adapterService)
  blobController.retrieveBlob(req, res)
})

router.get('/v1/blobs', authMiddleware, (req, res) => {
  const adapterService = new AdapterService(req.body.adapter)
  const blobController = new BlobController(adapterService)
  blobController.listBucketBlobs(req, res)
})

export { router as blobRoutes }
