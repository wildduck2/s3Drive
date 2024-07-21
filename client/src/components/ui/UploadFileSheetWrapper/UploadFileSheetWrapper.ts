import { SetUploadingFiles } from '@/components/layout'
import { UseUploadFileType } from '@/hooks'

export type UploadFileSheetContentType = {
  uploadedFiles: UseUploadFileType[]
  setUploadedFiles: SetUploadingFiles
}

export type UploadFileSheetFooterProps = {
  uploadedFiles: UseUploadFileType[]
  setUploadedFiles: SetUploadingFiles
  setState: React.Dispatch<
    React.SetStateAction<{
      sheet: boolean
      alert: boolean
    }>
  >
  invoke: () => void
}
