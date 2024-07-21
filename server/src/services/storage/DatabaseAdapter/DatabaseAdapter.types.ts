export type saveBlobMetaDataType = {
  id: string
  user_id: string
  blob_url: string
  blob_id: string | null
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
  nextPage: number | null
  prevPage: number | null
  pageSize: number
  totalCount: number
  totalPages: number
}
