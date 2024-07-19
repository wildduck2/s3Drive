import { AttachmentType } from '@/components/layout'

export type UseUploadFileType = {
  file: AttachmentType
  status: Status
}
export type Status = 'loading' | 'success' | 'error' | 'idel'
