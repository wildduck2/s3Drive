import { BinaryToTextEncoding } from 'crypto'

export type Sha256Type = {
  data: string
  encoding: BinaryToTextEncoding
}

export type HmacType = {
  key: string
} & Sha256Type &
  Sha256Type
