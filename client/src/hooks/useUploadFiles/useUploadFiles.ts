import { toast } from 'sonner'
import { setState, StoreFile } from '@/utils'
import { useMutation, useQuery } from '@tanstack/react-query'
import { SetUploadingFiles } from '@/components/layout'
import { UseUploadFileType } from './useUploadFiles.types'

export const useUploadFile = (uploadedFiles: UseUploadFileType[], setUploading: SetUploadingFiles) => {
  const uplaod = useMutation({
    mutationKey: ['file'],
    mutationFn: (file: UseUploadFileType) => StoreFile(file.file),
  })

  const invoke = () => {
    const uploadPromises = uploadedFiles.map(
      (file, idx) =>
        new Promise<UseUploadFileType>((resolve, reject) => {
          const cb = async () => {
            setState({ setState: setUploading, status: 'loading', idx })

            try {
              await uplaod.mutateAsync(file)

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