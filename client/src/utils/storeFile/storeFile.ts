import { AttachmentType } from '@/components/ui'
import { convertToBase64 } from '../base64'
import axios from 'axios'
import { toast } from 'sonner'

export type UploadRes = string | null

export async function StoreFile(filedata: AttachmentType, adapter: string): Promise<UploadRes | null> {
  const { id, name, size, type } = filedata
  const base64File = await convertToBase64(filedata.file)
  try {
    //NOTE: make the req
    const { data } = await axios.put<Awaited<Promise<UploadRes>>>(
      `http://localhost:3000/v1/blobs`,
      {
        id,
        name,
        size,
        type,
        data: base64File,
        adapter,
      },
      {
        headers: {
          Authorization: `Bearer your-secret-token`,
        },
      },
    )

    if (!data) return null

    return data
  } catch (error) {
    toast.error('failed to upload the file')
    return null
  }
}
