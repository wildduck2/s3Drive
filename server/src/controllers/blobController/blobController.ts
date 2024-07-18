// src/controllers/blobController.ts

import { Request, Response } from 'express'
import { AdapterService, DBService, S3Service } from '../../services'
import { StoreBlobBodyType } from './blobController.types'
import { Base64Utils, S3 } from '../../utils'
import { prisma } from '../..'
import { uuidv7 } from 'uuidv7'

class BlobController {
  private storageService: AdapterService

  constructor(adapterService: AdapterService) {
    this.storageService = adapterService
  }

  async storeBlob(req: Request, res: Response) {
    const { id, name, size, type, data } = req.body as StoreBlobBodyType

    let Base64Data = data
    try {
      //NOTE: checking if the file is base64 if not formate it
      if (!Base64Utils.isBase64(Base64Data)) {
        Base64Data = Base64Utils.encode(Base64Data)
      }

      //NOTE: uplaoding the file to the s3
      const s3blob = await S3Service.saveBlob({
        id,
        name,
        size,
        type,
        data: Base64Data
      })
      if (!s3blob) return res.status(401).json('failed to uplaod the file')

      //NOTE: Save metadata to the database
      const data = await DBService.saveBlobMetaData({
        user_id: 'a6f9914c-33ba-4788-aa18-12e658567c8d',
        type,
        name,
        blob_url: '',
        size: size!
      })
      if (!data)
        return res
          .status(400)
          .send({ error: 'failed to store file data into the db' })

      res
        .status(200)
        .send({ error: null, data: '', message: 'Blob stored successfully' })
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
