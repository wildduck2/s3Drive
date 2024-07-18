// src/controllers/blobController.ts

import { Request, Response } from 'express'
import { AdapterService, S3Service } from '../../services'
import { StoreBlobBodyType } from './blobController.types'
import { Base64Utils, S3 } from '../../utils'
import { prisma } from '../..'

class BlobController {
  private storageService: AdapterService

  constructor(adapterService: AdapterService) {
    this.storageService = adapterService
  }

  async storeBlob(req: Request, res: Response) {
    const { id, name, size, type, data } = req.body as StoreBlobBodyType

    const Base64Data = data
    try {
      if (!Base64Utils.isBase64(Base64Data)) {
        Base64Data = Base64Utils.encode(Base64Data)
      }

      const s3blob = await S3Service.saveBlob({
        id,
        name,
        size,
        type,
        data: Base64Data
      })

      // Save metadata to the database
      const data = await this.storageService.adapter.saveBlob({
        id,
        name,
        size,
        data: Base64Data
      })
      //
      // if (!data) return res.status(400).send({ error: 'Invalid Base64 data' })

      res
        .status(201)
        .send({ error: null, URL, message: 'Blob stored successfully' })
    } catch (error) {
      console.log(error)

      res.status(400).send({ error: 'Invalid Base64 data' })
    }
  }

  async retrieveBlob(req: Request, res: Response) {
    const { id } = req.params
    // try {
    //   const data = await this.storageService.getBlob(id)
    //   // Fetch metadata from the database
    //   const blob: Blob = {
    //     /* Fetch from DB */
    //   }
    //   res.status(200).send({
    //     id: blob.id,
    //     data: Base64Utils.encode(data),
    //     size: data.length,
    //     createdAt: blob.createdAt.toISOString()
    //   })
    // } catch (error) {
    //   res.status(404).send({ error: 'Blob not found' })
    // }
  }
}

export { BlobController }
