import { filesize } from 'filesize'
import { uuidv7 as ID } from 'uuidv7'
import {
  Button,
  ContextMenu,
  ContextMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui'
import axios, { AxiosResponse } from 'axios'
import { Icon } from '@/assets'
import * as React from 'react'
import { Inbox } from 'lucide-react'

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

export const AddAttachmentSheetWrapper = () => {
  const [uploadedFiles, setUploadedFiles] = React.useState<AttachmentType[]>([])
  const [data, setData] = React.useState<Data | null>(null)
  console.log(uploadedFiles, 'sdklfjsdlf')

  const getFileDataHandler = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files![0]

    try {
      const filedata: AttachmentType = {
        id: ID(),
        file: file,
        name: file.name.split('/')[0],
        type: file.type.split('/')[1],
        size: `${file.size / 1024}`,
        progress: 0,
        status: 'pending',
      }

      // generate signed url the file and use axios to upload
      setUploadedFiles((uploadedFiles) => [...uploadedFiles, filedata])

      return filedata
    } catch (error) {
      console.log(error)
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
                onChange={getFileDataHandler}
              />
            </ContextMenuTrigger>
          </ContextMenu>
        </div>

        <div className="add-attachment__body w-[484px]">
          <Table>
            <TableHeader>
              <TableRow className=" items-center">
                <TableHead className="w-[20px] pr-0">Delete</TableHead>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead className="w-[100px]">Type</TableHead>
                <TableHead className="w-[92px]">Size</TableHead>
                <TableHead className="w-[100px] text-left">Progress</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {uploadedFiles.map((invoice, idx) => {
                console.log(filesize(parseInt(invoice.size), { round: 2 }))

                return (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium w-[20px] pr-0">
                      <Button
                        variant="ghost"
                        className="p-0 "
                        onClick={() => {
                          setUploadedFiles((uploadedFiles) => uploadedFiles.filter((item) => item.id !== invoice.id))
                        }}
                      >
                        <Icon.trash2 className="size-[20px]" />
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">
                      <span className="inline-block font-medium truncate w-[100px] max-w-[66px]">{invoice.name}</span>
                    </TableCell>
                    <TableCell className="truncate w-[100px]"> {invoice.type.split('/')[0]}</TableCell>
                    <TableCell className="truncate w-[92px] max-w-[92]">
                      {filesize(+invoice.size * 1000, { round: 0 })}
                    </TableCell>
                    <TableCell className="w-[100px]">
                      {invoice.status}
                      {/* <Progress value={invoice.progress} className="w-[90%] h-[4px]" /> */}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
        <button onClick={() => uploadAllFilesHandler(uploadedFiles, data, uploadedFiles, setUploadedFiles)}>
          Upload
        </button>
      </div>
    </>
  )
}
export const uploadAllFilesHandler = async (
  files: AttachmentType[],
  data: Data,
  uploadedFiles: AttachmentType[],
  setUploadedFiles: (files: AttachmentType[]) => void,
): Promise<AxiosResponse[] | []> => {
  // Use Promise.all to wait for all asynchronous operations to complete
  const uploadFilesRecursively = async (files: AttachmentType[], index: number): Promise<AxiosResponse[] | []> => {
    if (files.length === 0) {
      return []
    }

    const [firstFile, ...remainingFiles] = files
    const manga = [...uploadedFiles]

    try {
      const res = await axios({
        method: 'put',
        url: firstFile.url,
        data: firstFile.file,
        headers: {
          apikey: data.token,
          authorization: `Bearer ${data.token}`,
        },
        onUploadProgress: (progressEvent) => {
          const newState = { ...uploadedFiles[index] }
          const { loaded, total } = progressEvent
          const percent = Math.floor((loaded * 100) / total!)

          firstFile.progress = percent

          if (percent === 100) {
            newState.status = 'Success'
            console.log('success')
          } else {
            newState.status = 'Uploading'
            console.log('uploading')
          }

          manga[index] = newState
          setUploadedFiles(manga)
          console.log(percent, firstFile.id)
        },
      })

      // If one of the requests is bad, the cycle will stop
      return [res, ...(await uploadFilesRecursively(remainingFiles, index + 1))]
    } catch (error) {
      console.error(error)
      return []
    }
  }

  return await uploadFilesRecursively(files, 0)
}
