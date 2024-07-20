import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'

export const UploadAdapterPicker = () => {
  return (
    <Select defaultValue="database">
      <SelectTrigger className="w-[180px] border-solid">
        <SelectValue
          placeholder="Select a Adapter"
          defaultValue={'localStorage'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Upload Adapter</SelectLabel>
          <SelectItem value="awss3">AWS S3</SelectItem>
          <SelectItem value="database">Database</SelectItem>
          <SelectItem value="localstorage">LocalStorage</SelectItem>
          <SelectItem value="ftp">FTP</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
