import { useState } from 'react'
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

const dropDownFields = {
    fontWeight: [
        400, 500, 600, 700
    ],
    fontSize: [16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40, 42, 44, 46, 48, 50]
}
export default function CustomDropdown({ onChangeHandler, dropDownType, preSelectedValue }) {
    const [selectedValue, setSelectedValue] = useState(preSelectedValue || dropDownFields[dropDownType][0]);
    const handleValueChange = (value) => {
        onChangeHandler(dropDownType, value)
        setSelectedValue(value);
    };
    return (
        <Menu as="div" class="relative inline-block text-left">
            <div>
                <Menu.Button class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                    {selectedValue}
                    <ChevronDownIcon class="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
                </Menu.Button>
            </div>
            <Menu.Items class="cursor-pointer absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div class="py-1">
                    {dropDownFields[dropDownType].map((item, index) => (
                        <Menu.Item key={index}>
                            <p class='text-gray-700' value={item} onClick={() => handleValueChange(item)}>
                                {item}
                            </p>
                        </Menu.Item>
                    ))}
                </div>
            </Menu.Items>
        </Menu >
    )
}
