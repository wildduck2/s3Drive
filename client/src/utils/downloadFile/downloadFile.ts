// export type DownLoadResponse = {}

import axios from 'axios'
import { toast } from 'sonner'

export async function DownloadFile({ id }: { id: string; adapter: string }) {
  const token = JSON.parse(localStorage.getItem('token')!) || ''

  try {
    //NOTE: make the req
    const { data } = await axios.get(`${process.env.ROOT_URL}/v1/blobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!data) return null

    return data
  } catch (error) {
    toast.error('failed to upload the file')
    return null
  }
}
