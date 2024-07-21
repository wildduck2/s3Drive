import axios from 'axios'
import { QueryKeyType, RetriveFilesRes } from './retriveFiles.types'
import { QueryFunctionContext } from '@tanstack/react-query'

export const retriveFiles = async ({ queryKey }: QueryFunctionContext) => {
  const [, { currentPage }] = queryKey as QueryKeyType
  const token = JSON.parse(localStorage.getItem('token')!) || ''

  try {
    const { data } = await axios.get<Awaited<Promise<{ error: string | null; data: RetriveFilesRes | null }>>>(
      'http://localhost:3000/v1/blobs',
      {
        params: {
          adapter: 'DATABASE',
          page: currentPage,
          pageSize: 5,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    )
    if (!data) return null

    return data.data
  } catch (error) {
    return null
  }
}
