export type BlobData = {
  id: string
  size: string
  type: string
  name: string
  user_id: string
  blob_url: string
  blob_id: string | null
  createdAt: Date
  data?: Buffer
}
