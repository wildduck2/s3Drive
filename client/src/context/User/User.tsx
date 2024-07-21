import { createSlice } from '@reduxjs/toolkit'
import { UserInitialStateType } from './User.types'

const userInitialState: UserInitialStateType = {
  user: null,
}

export const userSlice = createSlice({
  name: 'data',
  initialState: userInitialState,
  reducers: {
    getUserData: (state, action) => {
      state.user = action.payload
    },
  },
})

export const { getUserData } = userSlice.actions

export default userSlice.reducer
