export type UserInitialStateType = {
  user: User | null
}

export type User = {
  id: string
  firstName: string
  lastName: string
  userName: string
  email: string
  address: JSON
  lastLoginIp: string
  password: string
  passwordResetToken: string
  passwordResetTokenExpiration: Date
  created_at: Date
  updated_at: Date
}

export interface UserState {
  inputsValid: User
}

export interface UserAction {
  payload: User
}
