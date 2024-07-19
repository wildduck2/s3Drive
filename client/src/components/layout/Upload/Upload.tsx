import { Icon } from '@/assets'

import { uuidv7 as ID } from 'uuidv7'
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Input,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui'
import { cn, StoreFile } from '@/utils'
import * as React from 'react'
import { toast } from 'sonner'
import { filesize } from 'filesize'

export function Upload() {
  const [open, setOpen] = React.useState<boolean>(false)
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFilesType[]>([])

  function getFileDataHandler(e: React.ChangeEvent<HTMLInputElement>) {
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

  const invoke = useHandleFileUpload(uploadedFiles, setUploadedFiles)
  return (
    <Sheet
      open={open}
      onOpenChange={(state) => state !== open && setOpen(state)}
    >
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="gap-2"
        >
          <Icon.upload className="size-[19px]" />
          <span>Upload</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="dialog-content !w-[670px] grid h-full justify-center !max-w-xl">
        <SheetHeader>
          <SheetTitle>Media Upload</SheetTitle>
          <SheetDescription>Add your documents here, and you can upload up to 5 files max</SheetDescription>
        </SheetHeader>

        <div className="add-attachment">
          <div
            className={cn(
              'add-attachment__header',
              uploadedFiles.some((item) => item.status === 'loading') && 'opacity-50 pointer-events-none',
            )}
          >
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
            {uploadedFiles.map((invoice, idx) => {
              return (
                <li
                  key={invoice.file.id}
                  className={cn(
                    'grid gap-2 p-2 border border-border  border-solid rounded-md h-fit items-start',
                    invoice.status === 'loading'
                      ? 'bg-zinc-300/30 border-zinc-300/30 opacity-75'
                      : invoice.status === 'success'
                        ? 'bg-green-300/30 border-green-300/30'
                        : '',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        {invoice.status === 'loading' ? (
                          <Icon.spinner className="spinner size-[25px]" />
                        ) : invoice.status === 'success' ? (
                          <Icon.chekFile className="size-[35px]" />
                        ) : (
                          <Icon.iconBackground className="size-[35px]" />
                        )}
                      </div>
                      <div className="grid items-start">
                        <h3 className="inline-block font-medium text-[.97rem] truncate w-[300px]">
                          <span className="">{invoice.file.name}</span>
                        </h3>
                        <p className="truncate w-[92px] max-w-[92]">{filesize(+invoice.file.size, { round: 0 })}</p>
                      </div>
                    </div>

                    <div className="font-medium pr-0">
                      <Button
                        variant="ghost"
                        className="p-0 w-[1.8rem] h-[1.8rem]"
                        onClick={() => {
                          setUploadedFiles((uploadedFiles) =>
                            uploadedFiles.filter((item) => item.file.id !== invoice.file.id),
                          )
                        }}
                      >
                        {(uploadedFiles[idx].status === 'idel' || uploadedFiles[idx].status === 'error') && (
                          <Icon.X className="size-[20px]" />
                        )}
                      </Button>
                    </div>
                    {uploadedFiles[idx] === undefined && (
                      <div className="font-medium pr-0">
                        <Button
                          variant="ghost"
                          className="p-0 w-[1.8rem] h-[1.8rem]"
                          onClick={() => {
                            setUploadedFiles((uploadedFiles) =>
                              uploadedFiles.filter((item) => item.file.id !== invoice.file.id),
                            )
                          }}
                        >
                          <Icon.X className="size-[20px]" />
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        <SheetFooter>
          {uploadedFiles.every((item) => item.status !== 'success') && (
            <Button
              type="submit"
              className="w-28"
              onClick={() => {
                setUploadedFiles([])
                setOpen(false)
              }}
            >
              cancel
            </Button>
          )}

          <Button
            type="submit"
            className="w-28"
            disabled={!(uploadedFiles.length > 0)}
            onClick={() => {
              if (uploadedFiles.some((item) => item.status === 'success')) {
                setUploadedFiles([])
                setOpen(false)
              } else {
                invoke()
              }
            }}
          >
            {uploadedFiles.some((item) => item.status === 'success')
              ? 'Save'
              : uploadedFiles.some((item) => item.status === 'loading')
                ? 'Uploading'
                : 'Upload'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
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

const supportedFileTypes = [
  'image/jpeg',
  'image/png',
  'image/svg+xml',
  'application/zip',
  'video/mp4',
  'video/webm',
  'video/ogg',
]

function useHandleFileUpload(uploadedFiles: UploadedFilesType[], setUploading: SetUploading) {
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

export type UploadedFilesType = {
  file: AttachmentType
  status: Status
}
export type SetStateType = {
  setState: SetUploading
  status: Status
  idx: number
}
export type SetUploading = React.Dispatch<React.SetStateAction<UploadedFilesType[]>>
export type Status = 'loading' | 'success' | 'error' | 'idel'

export const setState = ({ setState, status, idx }: SetStateType) => {
  setState((state) => {
    const newState = [...state]
    newState[idx].status = status
    return newState
  })
}
