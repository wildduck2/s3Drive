import { filesize } from 'filesize'
import { uuidv7 as ID } from 'uuidv7'
import { Button, ContextMenu, ContextMenuTrigger, Input, Progress } from '@/components/ui'
import axios from 'axios'
import { Icon } from '@/assets'
import * as React from 'react'
import { on } from 'events'
import { toast } from 'sonner'
import { StoreFile } from '@/utils'

export type AttachmentType = {
  id: string
  file: File
  url?: string | undefined
  name: string
  type: string
  size: string
  progress: number
  status: string
}
export const user = 'TheVimagen-test-user'
interface Data {
  signedUrl: string
  token: string
  path: string
}
const supportedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/zip',
  'video/mp4',
  'video/webm',
  'video/ogg',
]
export const AddAttachmentSheetWrapper = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<AttachmentType[]>([])
  const [data, setData] = React.useState<Data | null>(null)

  const getFileDataHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files![0]
    try {
      //NOTE: check for the un acceptable file types
      if (file && !supportedFileTypes.includes(file.type)) return toast.error('File is supported:')

      if (file && file.size > 10 * 1024 * 1024) return toast.error('File has exceeded the max size')

      const filedata: AttachmentType = {
        id: ID(),
        file: file,
        name: file.name,
        type: file.type,
        size: `${file.size}`,
        progress: 0,
        status: 'pending',
      }

      setUploadedFiles((uploadedFiles) => [...uploadedFiles, filedata])

      const data = await StoreFile(filedata)
      if (!data) return toast.error('failed to uplaod the file')

      toast.success('filed uploaded successfully')
      return filedata
    } catch (error) {
      toast.error('failed to upload the file')
    }
  }

  return (
    <>
      <div className="add-attachment">
        <div className="add-attachment__header">
          <ContextMenu>
            <ContextMenuTrigger className="add-attachment__header__trigger">
              <div>
                <Icon.upload className="size-[30px]" />
                <span>Click to upload</span>
              </div>
              <Input
                placeholder="Filter emails..."
                type="file"
                accept={supportedFileTypes.join('')}
                onChange={getFileDataHandler}
              />
            </ContextMenuTrigger>
          </ContextMenu>
          <p className="mt-2 text-muted-foreground text-[.9rem]"> Only support .jpg, .png and .svg and zip files</p>
        </div>

        <ul className="add-attachment__body w-[484px] flex flex-col gap-2">
          {uploadedFiles.map((invoice) => {
            return (
              <li
                key={invoice.id}
                className="grid gap-2 p-2 border border-border  border-solid rounded-md h-fit items-start"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <span className="absolute top-1/2 left-1/2 translate-x-[-60%] translate-y-[-50%] text-white font-semibold">
                        {invoice.type}
                      </span>
                      <Icon.iconBackground className="size-[50px]" />
                    </div>
                    <div className="grid items-start">
                      <h3 className="inline-block font-medium text-[.97rem] truncate w-[300px]">
                        <span className="">{invoice.name}</span>
                      </h3>
                      <p className="truncate w-[92px] max-w-[92]">{filesize(+invoice.size, { round: 0 })}</p>
                    </div>
                  </div>
                  <div className="font-medium pr-0">
                    <Button
                      variant="ghost"
                      className="p-0 w-[1.8rem] h-[1.8rem]"
                      onClick={() => {
                        setUploadedFiles((uploadedFiles) => uploadedFiles.filter((item) => item.id !== invoice.id))
                      }}
                    >
                      <Icon.X className="size-[20px]" />
                    </Button>
                  </div>
                </div>
                <Progress
                  value={80}
                  className="h-1"
                />
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
