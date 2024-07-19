import { filesize } from 'filesize'
import { uuidv7 as ID } from 'uuidv7'
import { Button, ContextMenu, ContextMenuTrigger, Input, Progress } from '@/components/ui'
import axios from 'axios'
import { Icon } from '@/assets'
import * as React from 'react'
import { on } from 'events'
import { toast } from 'sonner'
import { cn, StoreFile } from '@/utils'

function useHandleFileUpload(uploadedFiles: AttachmentType[]) {
  const invoke = () => {
    const uploadPromises = uploadedFiles.map(
      (file, idx) =>
        new Promise<AttachmentType>((resolve, reject) => {
          const cb = async () => {
            setUploading((state) => {
              const newState = [...state]
              newState[idx] = 'loading'
              return newState
            })

            try {
              const data = await StoreFile(file)
              if (!data) {
                setUploading((state) => {
                  const newState = [...state]
                  newState[idx] = 'error'
                  return newState
                })
                reject(null)
              }

              resolve(file)
              setUploading((state) => {
                const newState = [...state]
                newState[idx] = 'success'
                return newState
              })
            } catch (error) {
              setUploading((state) => {
                const newState = [...state]
                newState[idx] = 'error'
                return newState
              })
              reject(null)
            }
          }

          // Initial call to the callback function
          cb()
        }),
    )

    const promise = Promise.all(uploadPromises)

    // Toast configuration
    toast.promise(promise, {
      success: 'Files uploaded successfully',
      loading: 'Uploading files',
      error: 'Failed to upload some files',
    })
  }
  return { invoke, uploading }
}

export const AddAttachmentSheetWrapper = () => {
  console.log(uploading)

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
        <Button onClick={invoke}> invoke </Button>
        <ul className="add-attachment__body w-[484px] flex flex-col gap-2">
          {uploadedFiles.map((invoice, idx) => {
            return (
              <li
                key={invoice.id}
                className={cn(
                  'grid gap-2 p-2 border border-border  border-solid rounded-md h-fit items-start',
                  uploading[idx] === 'loading'
                    ? 'bg-zinc-300/30 border-zinc-300/30 opacity-75'
                    : uploading[idx] === 'success'
                      ? 'bg-green-300/30 border-green-300/30'
                      : '',
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      {uploading[idx] === 'loading' ? (
                        <>
                          <Icon.spinner className="spinner size-[25px]" />
                        </>
                      ) : uploading[idx] === 'success' ? (
                        <>
                          <Icon.chekFile className="size-[35px]" />
                        </>
                      ) : (
                        <>
                          <Icon.iconBackground className="size-[35px]" />
                        </>
                      )}
                    </div>
                    <div className="grid items-start">
                      <h3 className="inline-block font-medium text-[.97rem] truncate w-[300px]">
                        <span className="">{invoice.name}</span>
                      </h3>
                      <p className="truncate w-[92px] max-w-[92]">{filesize(+invoice.size, { round: 0 })}</p>
                    </div>
                  </div>

                  {uploading[idx] === 'error' && uploading !== undefined && (
                    <div className="font-medium pr-0">
                      <Button
                        variant="ghost"
                        className="p-0 w-[1.8rem] h-[1.8rem]"
                        onClick={() => {
                          setUploadedFiles((uploadedFiles) => uploadedFiles.filter((item) => item.id !== invoice.id))
                        }}
                      >
                        <Icon.loop className="size-[20px]" />
                      </Button>
                    </div>
                  )}
                  {uploading[idx] === undefined && (
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
                  )}
                </div>
                {
                  // <Progress
                  //   value={80}
                  //   className="h-1"
                  // />
                }
              </li>
            )
          })}
        </ul>
      </div>
    </>
  )
}
