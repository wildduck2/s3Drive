import { AttachmentType } from '@/components/layout'
import { supportedFileTypes } from '@/constants'
import { toast } from 'sonner'
import { GetFileDataHandlerType } from './getFileDataHandler.types'
import { uuidv7 as ID } from 'uuidv7'

export function getFileDataHandler({ e, uploadedFiles, setUploadedFiles }: GetFileDataHandlerType) {
  const file = e.currentTarget.files![0]
  console.log(uploadedFiles.length === 5)

  if (uploadedFiles.length === 5) return toast.error('You can not upload more than 5 files once')

  // Check for unacceptable file types
  if (file && !supportedFileTypes.includes(file.type)) return toast.error('File type not supported')

  // Check if file size exceeds limit
  if (file && file.size > 10 * 1024 * 1024) return toast.error('File has exceeded the max size')

  const filedata: AttachmentType = {
    id: ID(),
    file: file,
    name: file.name,
    type: file.type,
    size: file.size.toString(),
    progress: 0,
    status: 'pending',
  }

  setUploadedFiles((uploadedFiles) => [...uploadedFiles, { file: filedata, status: 'idel' }])
}
