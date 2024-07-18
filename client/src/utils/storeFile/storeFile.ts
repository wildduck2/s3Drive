import { AttachmentType } from '@/components/ui'
import { convertToBase64 } from '../base64'
import axios from 'axios'
import { toast } from 'sonner'

export type UploadRes = string | null

export async function StoreFile(filedata: AttachmentType): Promise<UploadRes | null> {
  const base64File = await convertToBase64(filedata.file)
  try {
    //NOTE: make the req
    const { data } = await axios.put<Awaited<Promise<UploadRes>>>(
      `http://localhost:3000/v1/blobs`,
      {
        id: filedata.id,
        name: filedata.name,
        size: filedata.size,
        type: filedata.type,
        data: base64File,
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
