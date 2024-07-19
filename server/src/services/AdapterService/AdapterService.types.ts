import WebSocket from 'ws'

export type SaveBlob = {
  id: string
  name: string
  data: string
  type: string
  size?: string
  ws: WebSocket
}
