import { createSlice } from '@reduxjs/toolkit'
import { AdapterAction, AdapterState, initialStateTypes } from './Utils.types'

const initialState: initialStateTypes = {
  adapter: '',
}

export const utilsSlice = createSlice({
  name: 'utils',
  initialState,
  reducers: {
    setAdapter: (state: AdapterState, action: AdapterAction) => {
      state.adapter = action.payload
    },
  },
})

export const { setAdapter } = utilsSlice.actions

export default utilsSlice.reducer
