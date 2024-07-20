import { blobMetaData } from '@/components/layout'

export type PaginationType = {
  page: number
  pageSize: number
  totalCount: number
  totalPages: number
}
export type RetriveFilesRes = {
  blobs: blobMetaData[]
  pagination: PaginationType
}
