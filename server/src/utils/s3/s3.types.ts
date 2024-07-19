export type GetSignedUrlType = {
  id: string
  name: string
  type: string
}

export type RequestOptions = {
  method: string
  url: string
  headers:
    | {
        'Content-Type': string
        'Content-Length': number
        Host: string
      }
    | Record<string, string>
  data?: Buffer
}
