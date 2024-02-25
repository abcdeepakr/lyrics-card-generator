import { configureStore } from '@reduxjs/toolkit'
import LinkSearchSlice from './link-slice'
import LyricDataSlice from './lyrics-slice'
export const store = configureStore({
  reducer: {
    linkSearch: LinkSearchSlice,
    lyricData: LyricDataSlice
  },
})
