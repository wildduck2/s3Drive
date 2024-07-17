import { Icon } from '@/assets'
import {
  AddAttachmentSheetWrapper,
  Button,
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui'

export function Upload() {
  return (
    <Sheet>
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

        <AddAttachmentSheetWrapper />

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save Changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
