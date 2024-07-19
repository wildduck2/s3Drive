import { SetStateType } from './setState.types'

export const setState = ({ setState, status, idx }: SetStateType) => {
  setState((state) => {
    const newState = [...state]
    newState[idx].status = status
    return newState
  })
}
