import axios from 'axios'
import { QueryKeyType, RetriveFilesRes } from './retriveFiles.types'
import { QueryFunctionContext } from '@tanstack/react-query'

export const retriveFiles = async ({ queryKey }: QueryFunctionContext) => {
  const [, { currentPage }] = queryKey as QueryKeyType

  try {
    const { data } = await axios.get<Awaited<Promise<{ error: string | null; data: RetriveFilesRes | null }>>>(
      'http://localhost:3000/v1/blobs',
      {
        params: {
          page: currentPage,
          pageSize: 5,
        },
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
