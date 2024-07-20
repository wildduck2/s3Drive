import { blobMetaData } from '@/components/layout'

export type PaginationType = {
  page: number
  nextPage: number | null
  prevPage: number | null
  pageSize: number
  totalCount: number
  totalPages: number
}

export type RetriveFilesRes = {
  blobs: blobMetaData[]
  pagination: PaginationType
}
export type QueryKeyType = [
  string,
  {
    currentPage?: number | null
  },
]
