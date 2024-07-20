export type blobMetaData = {
  id: string
  size: string
  type: string
  name: string
  user_id: string
  blob_url: string
  blob_id: string | null
  createdAt: Date
} | null

export type UploadsTableContentProps = {
  blobs: blobMetaData[]
}

export type UploadsTablePaginationProps = {
  currentPage: number
  totalPages: number
  setCurrentPage: (value: React.SetStateAction<number>) => void
}
