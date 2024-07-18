import axios from 'axios'
import { SaveBlob } from '../..'
import { S3 } from '../../../utils/s3'
import { supportedFileTypes } from '../../../constants'

export class S3Service {
  static async saveBlob({
    id,
    name,
    type,
    data
  }: SaveBlob): Promise<string | null> {
    try {
      //NOTE: checking for the type
      if (!supportedFileTypes.includes(type)) return null

      //NOTE: get signed url
      const URL = await S3.getSignedURl({ id, name, type })
      if (!URL) return null

      //NOTE: uploading the file
      const res = await axios.put(URL, data, {
        headers: {
          'Content-Type': type
        }
      })
      if (!res) return null
      console.log(URL)

      return id + name
    } catch (error) {
      console.log(error)

      return null
    }
  }

  static async getBlob(id: string): Promise<Buffer> {
    // Implement S3 retrieval logic using HTTP client
  }
}
