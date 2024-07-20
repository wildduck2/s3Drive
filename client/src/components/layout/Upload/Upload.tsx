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
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  UploadFileSheetContent,
  UploadFileSheetFooter,
} from '@/components/ui'
import * as React from 'react'
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
            className="gap-2 w-fit"
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
