import { UseUploadFileType } from '@/hooks'

export type GetFileDataHandlerType = {
  e: React.ChangeEvent<HTMLInputElement>
  uploadedFiles: UseUploadFileType[]
  setUploadedFiles: React.Dispatch<React.SetStateAction<UseUploadFileType[]>>
}
