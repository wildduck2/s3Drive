import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
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
import { PaginationType, retriveFiles } from '@/utils'
import { FetchNextPageOptions, Mutation, useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { format, fromat } from 'date-fns'
import { filesize } from 'filesize'
import { MoreHorizontal } from 'lucide-react'

export default function UploadsTable() {
  const {
    data: blobs,
    status,
    fetchNextPage,
    fetchPreviousPage,
    isFetching,
  } = useInfiniteQuery({
    queryKey: ['files'],
    queryFn: retriveFiles,
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages - 1) {
        return lastPage.pagination.page + 1
      } else {
        return undefined
      }
    },
  })

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>File Uploaded </CardTitle>
          <CardDescription>Manage your Files and view their content or download them.</CardDescription>
        </CardHeader>
        <CardContent className="h-[560px]">
          <ScrollArea className="h-[535px] border border-border border-solid rounded-md">
            <Table>
              <UploadsTableHeader />

              {status === 'success' ? (
                <UploadsTableContent blobs={blobs.pages[0].blobs} />
              ) : (
                Array.from({ length: 10 }, (_, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-md bg-gray-200"
                  >
                    <p>Item {index + 1}</p>
                  </div>
                ))
              )}
            </Table>
          </ScrollArea>
        </CardContent>
        <CardFooter className="justify-start">
          {blobs && (
            <UploadsTablePagination
              pagination={blobs.pages[0].pagination}
              fetchNextPage={fetchNextPage}
              fetchPreviousPage={fetchPreviousPage}
            />
          )}
        </CardFooter>
      </Card>
    </>
  )
}

export const UploadsTableHeader = () => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="hidden w-[100px] sm:table-cell">
          <span className="sr-only"> Image </span>
        </TableHead>
        <TableHead className="md:max-w-[280px] lg:max-w-[400px] lg:w-[400px]"> Name </TableHead>
        <TableHead className="hidden md:table-cell w-[81px]"> Type </TableHead>
        <TableHead className="hidden md:table-cell w-[81px]"> Size </TableHead>
        <TableHead className="hidden md:table-cell w-[200px]"> Uploaded at </TableHead>
        <TableHead>
          <span className="sr-only"> Actions </span>
        </TableHead>
      </TableRow>
    </TableHeader>
  )
}
export type blobMetaData = {
  id: string
  size: string
  type: string
  name: string
  user_id: string
  blob_url: string
  blob_id: string | null
  createdAt: Date
} | null

export type UploadsTableContentProps = {
  blobs: blobMetaData[]
}

export const UploadsTableContent = ({ blobs }: UploadsTableContentProps) => {
  console.log(blobs)

  return blobs.length ? (
    <TableBody>
      {blobs.map((blob) => (
        <TableRow>
          <TableCell className="hidden sm:table-cell">
            <img
              alt={blob.name}
              src={blob.blob_url}
              className="aspect-square rounded-md object-cover"
              height="64"
              width="64"
            />
          </TableCell>
          <TableCell className="font-medium truncate md:max-w-[280px] lg:max-w-[400px] lg:kjw-[400px]">
            {blob.name}
          </TableCell>
          <TableCell className="hidden md:table-cell w-[81px]">
            <Badge variant="outline"> {blob.type.split('/')[1]} </Badge>
          </TableCell>
          <TableCell className="hidden md:table-cell w-[81px]"> {filesize(+blob.size, { round: 0 })} </TableCell>
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
                  <span className="sr-only"> Toggle menu </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions </DropdownMenuLabel>
                <DropdownMenuItem> Edit </DropdownMenuItem>
                <DropdownMenuItem> Download </DropdownMenuItem>
                <DropdownMenuItem> Share </DropdownMenuItem>
                <DropdownMenuItem> Delete </DropdownMenuItem>
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

export function UploadsTablePagination({
  pagination,
  fetchNextPage,
  fetchPreviousPage,
}: {
  pagination: PaginationType
  fetchNextPage: (options?: FetchNextPageOptions) => void
  fetchPreviousPage: () => void
}) {
  const { page, totalPages } = pagination

  const getPaginationItems = () => {
    return Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => (
      <PaginationItem key={pageNumber}>
        <PaginationLink isActive={pageNumber === page}>{pageNumber}</PaginationLink>
      </PaginationItem>
    ))
  }

  return (
    <Pagination>
      <PaginationContent>
        {page > 1 && (
          <PaginationItem>
            <PaginationPrevious href="#" />
          </PaginationItem>
        )}

        {getPaginationItems()}

        {page < totalPages && (
          <PaginationItem>
            <PaginationNext onClick={() => fetchNextPage({})} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  )
}
