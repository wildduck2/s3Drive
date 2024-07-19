import { Request, Response } from 'express'
import { AdapterService, DBService, S3Service } from '../../services'
import { StoreBlobBodyType } from './blobController.types'
import { ws } from '../..'
import { FormatUtils } from '../../utils/formateUtils'
import { config } from '../../config'

export class BlobController {
  private storageService: AdapterService

  constructor(adapterService: AdapterService) {
    this.storageService = adapterService
  }

  async storeBlob(req: Request, res: Response) {
    const { id, name, size, type, data } = req.body as StoreBlobBodyType

    let Base64Data = data
    try {
      //NOTE: checking if the file is base64 if not formate it
      if (!FormatUtils.isBase64(Base64Data)) {
        Base64Data = FormatUtils.encode(Base64Data)
      }

      //NOTE: uplaoding the file to the s3
      const s3blobUrl = await S3Service.saveBlob({
        id,
        name,
        size,
        type,
        data: Base64Data,
        ws
      })
      if (!s3blobUrl) return res.status(401).json('failed to uplaod the file')

      //NOTE: Save metadata to the database
      const data = await DBService.saveBlobMetaData({
        id,
        user_id: 'a6f9914c-33ba-4788-aa18-12e658567c8d',
        type,
        name,
        blob_url: s3blobUrl,
        size: size!.toString()
      })
      if (!data)
        return res
          .status(400)
          .send({ error: 'failed to store file data into the db' })

      return res.status(200).send({
        error: null,
        data: s3blobUrl,
        message: 'Blob stored successfully'
      })
    } catch (error) {
      return res.status(400).send({ error: 'Invalid Base64 data' })
    }
  }

  async retrieveBlob(req: Request, res: Response) {
    const { id } = req.params

    try {
      const blobMetaData = await DBService.retrievBlobMetaData({
        id,
        user_id: 'a6f9914c-33ba-4788-aa18-12e658567c8d'
      })

      if (!blobMetaData)
        res.status(404).send({ error: 'Blob not found', data: null })

      const blob = await S3Service.getBlob({ id })
      if (!blob)
        return res.status(404).send({ error: 'Blob not found', data: null })

      const blobData = {
        ...blobMetaData,
        data: blob
      }

      return res.status(200).json({ error: null, data: blobData })
    } catch (error) {
      return res.send({ error: 'Blob not found', data: null })
    }
  }

  async listBucketBlobs(req: Request, res: Response) {
    try {
      const blobs = await S3Service.listS3Objects({
        prefix: '',
        delimiter: '/',
        maxKeys: 10
      })

      // if (!blobs)
      //   return res
      //     .status(404)
      //     .json({ error: 'Failed to show bucket content', data: null })

      return res.status(200).json({ error: null, data: blobs })
    } catch (error) {
      return res.status(404).json({
        error: 'Failed to show bucket content',
        data: null,
        errorr: error
      })
    }
  }
}
