import { Icon } from '@/assets'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
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
import { cn, getFileDataHandler } from '@/utils'
import * as React from 'react'
import { filesize } from 'filesize'
import { supportedFileTypes } from '@/constants'
import { UseUploadFileType, useUploadFile } from '@/hooks'
import { useCallback, useState } from 'react'

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

export type SetUploadingFiles = React.Dispatch<React.SetStateAction<UseUploadFileType[]>>

export function Upload() {
  const [uploadedFiles, setUploadedFiles] = React.useState<UseUploadFileType[]>([])

  const [state, setState] = useState<{ sheet: boolean; alert: boolean }>({ alert: false, sheet: false })

  const handleAlertCancel = useCallback(() => {
    setState((prevState) => ({ ...prevState, alert: false, sheet: true }))
  }, [])

  const handleAlertContinue = useCallback(() => {
    setState((prevState) => ({ ...prevState, alert: false, sheet: false }))
    setUploadedFiles([])
  }, [])

  const handleSheetOnChange = useCallback(
    (state: boolean) => {
      setState((prevState) => ({
        alert: uploadedFiles.length > 0 && !state ? true : prevState.alert,
        sheet: state,
      }))
    },
    [uploadedFiles.length],
  )

  const invoke = useUploadFile(uploadedFiles, setUploadedFiles)

  return (
    <AlertDialog open={state.alert}>
      <Sheet
        open={state.sheet}
        onOpenChange={handleSheetOnChange}
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
          <UploadFileSheetContent
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
          />
          <UploadFileSheetFooter
            setState={setState}
            setUploadedFiles={setUploadedFiles}
            uploadedFiles={uploadedFiles}
            invoke={invoke}
          />
        </SheetContent>
      </Sheet>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account and remove your data from our
            servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleAlertCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleAlertContinue}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export type UploadFileSheetContentType = {
  uploadedFiles: UseUploadFileType[]
  setUploadedFiles: SetUploadingFiles
}

export const UploadFileSheetContent = ({ uploadedFiles, setUploadedFiles }: UploadFileSheetContentType) => {
  return (
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
              onChange={(e) => getFileDataHandler({ e, uploadedFiles, setUploadedFiles })}
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
  )
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
export const UploadFileSheetFooter = ({
  uploadedFiles,
  setUploadedFiles,
  setState,
  invoke,
}: UploadFileSheetFooterProps) => {
  return (
    <SheetFooter>
      {uploadedFiles.every((item) => item.status !== 'success') && (
        <Button
          type="submit"
          className="w-28"
          onClick={() => {
            setUploadedFiles([])
            setState((prevState) => ({ ...prevState, sheet: false }))
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
            setState((prevState) => ({ ...prevState, sheet: false }))
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
  )
}
