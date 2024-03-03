import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    lyric: "",
    fontFamily: "Verdana, sans-serif",
    fontSize: "",
    fontColor: "#000000",
    fontWeight: "",
    backgroundColor: "#ffffff"
}

export const lyricDataSlice = createSlice({
    name: 'add-lyrics',
    initialState,
    reducers: {
        saveLyrics: (state, data) => {

            state = { ...state, ...data.payload }
            return state
        }
    },
})

// Action creators are generated for each case reducer function
export const { saveLyrics } = lyricDataSlice.actions

export default lyricDataSlice.reducer