import { SaveBlob } from '../../services'

export type StoreBlobBodyType = SaveBlob

export type ListBlobsMetaDataType = {
  pageSize: string
  page: string
}
