import axios from 'axios'
import { RetriveFilesRes } from './retriveFiles.types'

export const retriveFiles = async () => {
  try {
    const { data } = await axios.get<Awaited<Promise<{ error: string | null; data: RetriveFilesRes | null }>>>(
      'http://localhost:3000/v1/blobs',
      {
        headers: {
          Authorization: `Bearer your-secret-token`,
        },
      },
    )
    if (!data) return null

    return data.data
  } catch (error) {
    return null
  }
}
