import { createSlice } from '@reduxjs/toolkit'

export interface ErrorState {
  message: string
}

export interface UserInfo {
  name: string
}

const initialErrorState: ErrorState = {
  message: '',
}

const errorSlice = createSlice({
  name: 'error',
  initialState: initialErrorState,
  reducers: {
    notify: (state, { payload: { message } }) => {
      state.message = message
    },
    unnotify: state => {
      state.message = ''
    },
  },
})

export const { notify, unnotify } = errorSlice.actions
export default errorSlice.reducer
