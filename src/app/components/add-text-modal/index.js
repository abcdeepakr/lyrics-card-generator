import { useState } from 'react';
import Draggable from 'react-draggable'; // The default
import { useDispatch, useSelector } from "react-redux";
import SelectFontDropdown from './select-font-dropdown';
import CustomDropdown from './dropdown';
import {
    saveLyrics
} from "../../store/lyrics-slice";
const AddTextModal = ({ onCloseCallback }) => {
    const dispatch = useDispatch();
    const { lyricData = {} } = useSelector((state) => state);
    const [currentLyrics, setCurrentLyrics] = useState({})
    const addLyricHandler = () => {
        dispatch(saveLyrics(currentLyrics));
        onCloseCallback()
    }
    const onChangeHandler = (key, value) => {
        setCurrentLyrics({ ...currentLyrics, [key]: value })
    }
    return (
        <Draggable cancel=".disableDrag">
            <div id="crud-modal" tabindex="-1" aria-hidden="true" 
            class="w-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 
            left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] sm:w-[auto] ">
                <div class="relative p-4 min-w-[500px] max-h-full sm:min-w-[300px]">
                    <div class="relative bg-white shadow border-2 border-lime-300 rounded-lg">
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                            <h3 class="text-lg font-semibold text-gray-900 ">
                                Add Lyrics<p class="text-xs"> (you can drag me too)</p>
                            </h3>
                            <button type="button" 
                            class="disableDrag text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={onCloseCallback}>
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <p class="pl-5 md-2">Text preview {currentLyrics.lyric ? ":" : "(start typing to see text)"}</p>
                        <p class="text-black text-left pl-5"
                            style={{
                                fontFamily: currentLyrics.fontFamily,
                                fontWeight: currentLyrics.fontWeight,
                                color: currentLyrics.fontColor,
                                backgroundColor: currentLyrics.backgroundColor,
                                width: "fit-content",
                                whiteSpace: 'pre-wrap',
                                fontSize: currentLyrics.fontSize + "px"
                            }}>
                            {currentLyrics.lyric?.split('\n').map((line, index) => (
                                <div class="w-fit" key={index}>{line}</div>
                            ))}
                        </p>
                        <form class="p-4 md:p-5">
                            {/* input box */}
                            <div class="col-span-2">
                                <textarea onChange={(e) => onChangeHandler("lyric", e.target.value)}  onMouseDown={e => e.stopPropagation()} id="description" rows="4" 
                                class="disableDrag block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 " placeholder="nass maine kaati usme dilli nikli" value={currentLyrics.lyric || ""}></textarea>
                            </div>
                            <div class="flex flex-col flex-wrap">
                                {/* select font dropdown */}
                                <SelectFontDropdown onChangeHandler={onChangeHandler} type="fontFamily" />
                                {/* font color */}
                                <div class="flex flex-row mt-4">
                                    <label class="text-black pr-2" for="fontColor">Font color</label>
                                    <input class="disableDrag" type="color" id="fontColor" name="fontColor" value={currentLyrics.fontColor || lyricData.fontColor || "#000000"} onChange={(e) => onChangeHandler("fontColor", e.target.value)} />
                                </div>
                                {/* font background color */}
                                <div class="flex flex-row mt-4">
                                    <label class="text-black pr-2" for="backgroundColor">background color</label>
                                    <input class="disableDrag" type="color" id="backgroundColor" name="backgroundColor" value={currentLyrics.backgroundColor || lyricData.backgroundColor || "#fff"} onChange={(e) => onChangeHandler("backgroundColor", e.target.value)} />
                                </div>

                                {/* font size */}
                                <div class="flex flex-row mt-4">
                                    <label class="block mr-4 font-medium text-gray-900">Font size:</label>
                                    <CustomDropdown onChangeHandler={onChangeHandler} dropDownType="fontSize" preSelectedValue={lyricData.fontSize} />
                                </div>

                                {/* font weight */}
                                <div class="flex flex-row mt-4">
                                    <label class="block mr-4 font-medium text-gray-900 ">Font weight:</label>
                                    <CustomDropdown onChangeHandler={onChangeHandler} dropDownType="fontWeight" preSelectedValue={lyricData.fontWeight} />
                                </div>
                                {/* add button */}
                                <button type="button" onClick={() => addLyricHandler()} class="disableDrag text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center ">
                                    <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                    add lyric
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </Draggable >
    )
}

export default AddTextModal