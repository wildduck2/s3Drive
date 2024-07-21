import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { setAdapter } from '@/context'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

export const UploadAdapterPicker = () => {
  const dispatch = useDispatch()

  //NOTE: you could  use cookie  or anything else to get the prev value
  useEffect(() => {
    dispatch(setAdapter('AMAZON_S3'))
  }, [])

  return (
    <Select
      defaultValue="AMAZON_S3"
      onValueChange={(adapter) => dispatch(setAdapter(adapter))}
    >
      <SelectTrigger className="w-[180px] border-solid">
        <SelectValue
          placeholder="Select a Adapter"
          defaultValue={'localStorage'}
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Upload Adapter</SelectLabel>
          {adapters.map((adapter, idx) => {
            return (
              <SelectItem
                value={adapter}
                key={idx}
              >
                {adapter}
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

const adapters = ['AMAZON_S3', 'DATABASE', 'LOCAL', 'FTP']
