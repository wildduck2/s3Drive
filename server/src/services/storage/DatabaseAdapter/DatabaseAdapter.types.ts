export type saveBlobMetaDataType = {
  id: string
  user_id: string
  blob_url: string
  size: string
  name: string
  type: string
}

export type RetrievBlobMetaDataType = {
  id: string
  user_id: string
}

export type ListBlobsMetaDataType = {
  page: string
  pageSize: string
}

export type PaginationType = {
  page: number
  nextPage: number
  prevPage: number
  pageSize: number
  totalCount: number
  totalPages: number
}
