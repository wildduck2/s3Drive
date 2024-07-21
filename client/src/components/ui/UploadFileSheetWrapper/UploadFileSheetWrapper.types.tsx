import { Button } from '../Button'
import { SheetFooter } from '../Sheet'
import { Icon } from '@/assets'
import { filesize } from 'filesize'
import { cn, getFileDataHandler } from '@/utils'
import { ContextMenu, ContextMenuTrigger, Input } from '..'
import { supportedFileTypes } from '@/constants'
import { UploadFileSheetContentType, UploadFileSheetFooterProps } from './UploadFileSheetWrapper'
import { Status } from '@/hooks'
import { queryClient } from '@/main'

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

export const UploadFileSheetFooter = ({
  uploadedFiles,
  setUploadedFiles,
  setState,
  invoke,
}: UploadFileSheetFooterProps) => {
  const getStatusCheck = (status: Status) => uploadedFiles.some((item) => item.status === status)
  return (
    <SheetFooter>
      {getStatusCheck('idel') && (
        <Button
          type="submit"
          variant="secondary"
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
        disabled={!(uploadedFiles.length > 0) || getStatusCheck('loading')}
        onClick={() => {
          if (getStatusCheck('success')) {
            setUploadedFiles([])
            setState((prevState) => ({ ...prevState, sheet: false }))
            queryClient.refetchQueries({ queryKey: ['files'] })
          } else {
            invoke()
          }
        }}
      >
        {getStatusCheck('success') ? 'Save' : getStatusCheck('loading') ? 'Uploading' : 'Upload'}
      </Button>
    </SheetFooter>
  )
}
