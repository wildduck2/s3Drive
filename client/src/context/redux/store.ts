import { configureStore } from '@reduxjs/toolkit'
import { combineReducers } from 'redux'
import utilsReducer from '../Utils/Utils'

export type RootState = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
  utils: utilsReducer,
})

export const store = configureStore({
  reducer: {
    utils: utilsReducer,
  },
})
