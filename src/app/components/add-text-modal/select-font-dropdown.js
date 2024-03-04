import { useState } from 'react'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const webSafeFonts = [
    { name: "Verdana", fontFamily: "Verdana, sans-serif" },
    { name: "Arial", fontFamily: "Arial, sans-serif" },
    { name: "Helvetica", fontFamily: "Helvetica, sans-serif" },
    { name: "Tahoma", fontFamily: "Tahoma, sans-serif" },
    { name: "Trebuchet MS", fontFamily: "Trebuchet MS, sans-serif" },
    { name: "Georgia", fontFamily: "Georgia, serif" },
    { name: "Palatino Linotype", fontFamily: "Palatino Linotype, Book Antiqua, Palatino, serif" },
    { name: "Times New Roman", fontFamily: "Times New Roman, Times, serif" },
    { name: "Courier New", fontFamily: "Courier New, Courier, monospace" },
    { name: "Lucida Console", fontFamily: "Lucida Console, Monaco, monospace" },
    { name: "Poppins", fontFamily: "Poppins, sans-serif" },
    { name: "Impact", fontFamily: "impact" },
    { name: "Monospace", fontFamily: "monospace" },
    { name: "Cursive", fontFamily: "cursive" }
];
export default function SelectFontDropdown({ onChangeHandler }) {
    const [selectedFont, setSelectedFont] = useState(webSafeFonts[0].fontFamily);
    const handleFontChange = (fontData) => {
        onChangeHandler("fontFamily", fontData.fontFamily)
        setSelectedFont(fontData.name);
    };
    return (
        <Menu as="div" class="relative inline-block text-left">
            <div>
                <Menu.Button class="disableDrag inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedFont}
                    <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Menu.Items class="cursor-pointer absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    {webSafeFonts.map((font, index) => (
                        <Menu.Item key={index}>
                            <p class='disableDrag text-gray-700' value={font.fontFamily} onClick={() => handleFontChange(font)}>
                                {font.name}

                            </p>
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Menu >
    )
}
