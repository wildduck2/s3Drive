import { toast } from 'sonner'
import { SetUploading, UploadedFilesType } from './useUploadFiles.types'
import { setState, StoreFile } from '@/utils'
import { useCallback } from 'react'

export const useUploadFile = (uploadedFiles: UseUploadFile[], setUploading: SetUploading) => {
  const invoke = () => {
    const uploadPromises = uploadedFiles.map(
      (file, idx) =>
        new Promise<UploadedFilesType>((resolve, reject) => {
          const cb = async () => {
            setState({ setState: setUploading, status: 'loading', idx })

            try {
              const data = await StoreFile(file.file)
              if (!data) {
                setState({ setState: setUploading, status: 'error', idx })
                reject(null)
              }

              resolve(file)
              setState({ setState: setUploading, status: 'success', idx })
            } catch (error) {
              setState({ setState: setUploading, status: 'error', idx })
              reject(null)
            }
          }
          cb()
        }),
    )

    const promise = Promise.all(uploadPromises)
    toast.promise(promise, {
      success: 'Files uploaded successfully',
      loading: 'Uploading files',
      error: 'Failed to upload some files',
    })
  }
  return invoke
}
