import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  searchUrl: "",
  isLoading:false,
  isError:false,
  content:{},
  artistsData:{}
}

export const LinkSearchSlice = createSlice({
  name: 'link-search',
  initialState,
  reducers: {
    linkSearchInitiated: (state) => {
      state.isLoading = true
    },
    linkSearchSuccess: (state, action) => {
      console.log("payload", action)
      state.isLoading = false
      state.searchUrl = action.payload.url
      state.content = action.payload.content
    },
    linkSearchFailed: (state, action) => {
      state.isLoading = false
      state.isError = true
    },
    artistSearchSuccess: (state, action) => {
      console.log("payload", action)
      state.isLoading = false
      state.artistsData = action.payload.artistsData
    },
  },
})

// Action creators are generated for each case reducer function
export const { linkSearchInitiated, linkSearchSuccess, linkSearchFailed,artistSearchSuccess } = LinkSearchSlice.actions

export default LinkSearchSlice.reducer