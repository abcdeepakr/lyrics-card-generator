import { useState } from 'react';
import Draggable from 'react-draggable'; // The default
import { useDispatch } from "react-redux";
import SelectFontDropdown from './select-font-dropdown';
import CustomDropdown from './dropdown';
import {
    saveLyrics
} from "../../store/lyrics-slice";
const AddTextModal = ({ onCloseCallback }) => {
    const dispatch = useDispatch();
    const [currentLyrics, setCurrentLyrics] = useState({ fontSize: 16 })
    const addLyricHandler = () => {
        dispatch(saveLyrics(currentLyrics));
        onCloseCallback()
    }
    const onChangeHandler = (key, value) => {
        setCurrentLyrics({ ...currentLyrics, [key]: value })
    }
    return (
        <Draggable>
            <div id="crud-modal" tabindex="-1" aria-hidden="true" class="w-full overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center md:inset-0 h-[calc(100%-1rem)] ">
                <div class="relative p-4 w-full max-h-full">
                    <div class="relative bg-white rounded-lg shadow dark:bg-gray-700">
                        <div class="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                                Add Lyrics<p class="text-xs"> (you can drag me too)</p>
                            </h3>
                            <button type="button" class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white" data-modal-toggle="crud-modal" onClick={onCloseCallback}>
                                <svg class="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                                </svg>
                                <span class="sr-only">Close modal</span>
                            </button>
                        </div>
                        <p class="text-black text-left"
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
                                <div key={index}>{line}</div>
                            ))}
                        </p>
                        <form class="p-4 md:p-5">

                            {/* input box */}
                            <div class="grid gap-4 mb-4 grid-cols-2">
                                <div class="col-span-2">
                                    <textarea onChange={(e) => onChangeHandler("lyric", e.target.value)} id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="nass maine kaati usme dilli nikli" value={currentLyrics.lyric || ""}></textarea>
                                </div>
                            </div>

                            {/* select font dropdown */}
                            <SelectFontDropdown onChangeHandler={onChangeHandler} type="fontFamily" />

                            {/* font color */}
                            <label class="text-black" for="fontColor">Font color</label>
                            <input type="color" id="fontColor" name="fontColor" value={currentLyrics.fontColor || "black"} onChange={(e) => onChangeHandler("fontColor", e.target.value)} />

                            {/* font background color */}
                            <label class="text-black" for="backgroundColor">background color</label>
                            <input type="color" id="backgroundColor" name="backgroundColor" value={currentLyrics.backgroundColor || "#fff"} onChange={(e) => onChangeHandler("backgroundColor", e.target.value)} />

                            {/* font size */}
                            {/* <label for="number-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">font size:</label>
                            <input max="64" type="number" id="number-input" aria-describedby="helper-text-explanation" value={currentLyrics.fontSize || "16"} class="w-16 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="16" onChange={(e) => onChangeHandler("fontSize", e.target.value)} /> */}
                            <CustomDropdown onChangeHandler={onChangeHandler} dropDownType="fontSize" />
                            <CustomDropdown onChangeHandler={onChangeHandler} dropDownType="fontWeight" />
                            {/* add button */}
                            <button type="button" onClick={() => addLyricHandler()} class="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                                <svg class="me-1 -ms-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"></path></svg>
                                add lyric
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </Draggable >
    )
}

export default AddTextModal