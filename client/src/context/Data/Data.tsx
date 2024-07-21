import { createSlice } from '@reduxjs/toolkit'
import { initialStateTypes } from './Data.types'

const initialState: initialStateTypes = {}

export const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {},
})

export const {} = dataSlice.actions

export default dataSlice.reducer
