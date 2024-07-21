import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
  Badge,
  ScrollArea,
} from '@/components/ui'
import { retriveFiles } from '@/utils'
import { Mutation, useMutation, useQuery } from '@tanstack/react-query'
import { format } from 'date-fns'
import { filesize } from 'filesize'
import { MoreHorizontal } from 'lucide-react'
import { useRef, useState } from 'react'
import { UploadsTableContentProps, UploadsTablePaginationProps } from './UploadsTable.types'
import { Icon } from '@/assets'
import { toast } from 'sonner'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '@/context'

//NOTE: just a function will be removed later
export const comminSoon = () => toast.info('this feature is not ready yet will come soon!!')

export function UploadsTable() {
  const [currentPage, setCurrentPage] = useState<number>(1)
  const { data, status, isError } = useQuery({
    queryKey: ['files', { currentPage }],
    queryFn: retriveFiles,
    refetchOnWindowFocus: false,
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>File Uploaded</CardTitle>
        <CardDescription>Manage your Files and view their content or download them.</CardDescription>
      </CardHeader>
      <CardContent className="h-[560px] w-[1000px]">
        <ScrollArea className="h-[535px] border border-border border-solid rounded-md">
          <Table>
            <UploadsTableHeader />
            {status === 'success' && !isError ? (
              <UploadsTableContent blobs={data?.blobs} />
            ) : (
              <TableBody className="relative h-[446px]">
                <TableRow>
                  <TableCell>
                    <Icon.spinner className="spinner absolute top-1/2 left-1/2" />
                  </TableCell>
                </TableRow>
              </TableBody>
            )}
          </Table>
        </ScrollArea>
      </CardContent>
      <CardFooter className="justify-start">
        {data && (
          <UploadsTablePagination
            currentPage={currentPage}
            totalPages={data.pagination.totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </CardFooter>
    </Card>
  )
}

export const UploadsTableHeader = () => (
  <TableHeader>
    <TableRow>
      <TableHead className="hidden w-[96.43px] sm:table-cell">
        <span className="sr-only"> Image </span>
      </TableHead>
      <TableHead className="md:max-w-[280px] lg:max-w-[400px] lg:w-[400px]"> Name </TableHead>
      <TableHead className="hidden md:table-cell w-[81px]"> Type </TableHead>
      <TableHead className="hidden md:table-cell w-[81px]"> Size </TableHead>
      <TableHead className="hidden md:table-cell w-[200px]"> Uploaded at </TableHead>
      <TableHead className="w-[71.95px]">
        <span className="sr-only"> Actions </span>
      </TableHead>
    </TableRow>
  </TableHeader>
)

export type DownLoadResponse = {}

export async function DownloadFile({ id, adapter }: { id: string; adapter: string }): Promise<DownLoadResponse | null> {
  const token = JSON.parse(localStorage.getItem('token'))

  console.log(id)

  try {
    //NOTE: make the req
    const { data } = await axios.get<Awaited<Promise<DownLoadResponse>>>(`${process.env.ROOT_URL}/v1/blobs/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!data) return null

    return data
  } catch (error) {
    toast.error('failed to upload the file')
    return null
  }
}

export const UploadsTableContent = ({ blobs }: UploadsTableContentProps) => {
  const adapter = useSelector((state: RootState) => state.utils.adapter)
  const downloadFileRef = useRef<string>(null)
  const { mutateAsync } = useMutation({
    mutationKey: ['download'],
    mutationFn: () => DownloadFile({ id: downloadFileRef.current, adapter }),
  })
  return blobs?.length ? (
    <TableBody>
      {blobs.map((blob) => (
        <TableRow key={blob.id}>
          <TableCell className="hidden sm:table-cell w-[100px]">
            <img
              alt={blob.name}
              src={blob.blob_url}
              className="aspect-square rounded-md object-cover"
              height="64"
              width="64"
            />
          </TableCell>
          <TableCell className="font-medium truncate max-w-[200px] w-[200px] ">{blob.name}</TableCell>
          <TableCell className="hidden md:table-cell w-[81px]">
            <Badge variant="outline">{blob.type.split('/')[1]}</Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell w-[81px]">{filesize(+blob.size, { round: 0 })}</TableCell>
          <TableCell className="hidden md:table-cell w-[200px]">{format(new Date(blob.createdAt), 'PPpp')}</TableCell>
          <TableCell>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-haspopup="true"
                  size="icon"
                  variant="ghost"
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={comminSoon}>Edit</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    downloadFileRef.current = blob.id
                    mutateAsync()
                  }}
                >
                  Download
                </DropdownMenuItem>
                <DropdownMenuItem onClick={comminSoon}>Share</DropdownMenuItem>
                <DropdownMenuItem onClick={comminSoon}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  ) : (
    <TableBody>
      <TableRow>
        <TableCell
          colSpan={6}
          className="text-center h-[485px]"
        >
          <p className="text-center whitespace-nowrap place-self-center">There's no Files Uploaded</p>
        </TableCell>
      </TableRow>
    </TableBody>
  )
}

export function UploadsTablePagination({ currentPage, totalPages, setCurrentPage }: UploadsTablePaginationProps) {
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage === 1}
            className="border-solid border p-0"
            onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          >
            <PaginationPrevious className="w-[8rem]" />
          </Button>
        </PaginationItem>
        <Badge
          className="w-[4rem] h-[2rem] flex justify-center items-center border-solid border p-0 text-[.8rem]"
          variant="outline"
        >
          {currentPage}/{totalPages}
        </Badge>

        <PaginationItem>
          <Button
            variant="outline"
            disabled={currentPage >= totalPages}
            className="border-solid border p-0"
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <PaginationNext className="w-[8rem]" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
