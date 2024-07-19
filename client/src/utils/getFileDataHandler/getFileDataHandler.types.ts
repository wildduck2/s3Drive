import { SetUploading, UploadedFilesType } from '@/hooks'

export type GetFileDataHandlerType = {
  e: React.ChangeEvent<HTMLInputElement>
  uploadedFiles: UploadedFilesType[]
  setUploadedFiles: SetUploading
}
