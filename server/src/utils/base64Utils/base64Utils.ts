import { Base64 } from 'js-base64'

export class Base64Utils {
  static encode(data: string): string {
    return Base64.encode(data)
  }

  static decode(base64: string): string {
    return Base64.decode(base64)
  }

  static isBase64(data: string): boolean {
    return btoa(atob(data)) == data
  }
}
