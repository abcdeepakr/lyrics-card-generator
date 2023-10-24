import { configureStore } from '@reduxjs/toolkit'
import LinkSearchSlice from '../components/LinkSearch/link-slice'

export const store = configureStore({
  reducer: {
    linkSearch: LinkSearchSlice,
  },
})
