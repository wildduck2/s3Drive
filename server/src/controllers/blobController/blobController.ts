import { Request, Response } from 'express'
import { ActionLog, AdapterService, DBService, S3Service } from '../../services'
import { StoreBlobBodyType } from './blobController.types'
import { FormatUtils } from '../../utils/formateUtils'
const user_id = '56159557-5a2b-4200-8c45-d263d34e42b1'

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
        data: Base64Data
      })
      if (!s3blobUrl)
        return res
          .status(401)
          .json({ error: 'failed to uplaod the file', data: null })

      //NOTE: Save metadata to the database
      const data = await DBService.saveBlobMetaData({
        id,
        user_id,
        type,
        name,
        blob_url: s3blobUrl,
        size: size!.toString()
      })
      if (!data)
        return res
          .status(400)
          .send({ error: 'failed to store file data into the db', data: null })

      //NOTE: tracking actions
      const action = await ActionLog.storeAction({
        action: 'uploading file to the s3 bucket',
        user_id,
        blobs_id: id
      })
      if (!action)
        return res
          .status(404)
          .json({ error: 'failed to track this action', data })

      return res.status(200).send({
        error: null,
        data
      })
    } catch (error) {
      return res.status(400).send({ error: 'Invalid Base64 data' })
    }
  }

  async retrieveBlob(req: Request, res: Response) {
    const { id } = req.params

    try {
      //NOTE: getting metadata
      const blobMetaData = await DBService.retrievBlobMetaData({
        id,
        user_id: 'a6f9914c-33ba-4788-aa18-12e658567c8d'
      })
      if (!blobMetaData)
        res.status(404).send({ error: 'Blob not found', data: null })

      //NOTE: getting the blob file
      const blob = await S3Service.getBlob({ id })
      if (!blob)
        return res.status(404).send({ error: 'Blob not found', data: null })

      const blobData = {
        ...blobMetaData,
        data: blob
      }

      //NOTE: tracking actions
      const action = await ActionLog.storeAction({
        action: 'getting blob form the s3 bucket',
        user_id,
        blobs_id: id
      })
      if (!action)
        return res
          .status(404)
          .json({ error: 'failed to track this action', blobData })

      return res.status(200).json({ error: null, data: blobData })
    } catch (error) {
      return res.send({ error: 'Blob not found', data: null })
    }
  }

  async listBucketBlobs(req: Request, res: Response) {
    try {
      const blobs = await DBService.listBlobsMetaData()

      if (!blobs)
        return res
          .status(404)
          .json({ error: 'Failed to show bucket content', data: null })

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
