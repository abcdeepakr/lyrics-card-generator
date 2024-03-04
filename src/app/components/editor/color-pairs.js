import React from 'react'
const COLOR_PAIRS = [
    { id: 1, backgroundColor: '#FFFFFF', textColor: '#000000' }, // White background with black text
    { id: 2, backgroundColor: '#000000', textColor: '#FFFFFF' }, // Black background with white text
    { id: 3, backgroundColor: '#F0F0F0', textColor: '#1E1E1E' }, // Light gray background with dark gray text
    { id: 4, backgroundColor: '#1E1E1E', textColor: '#F0F0F0' }, // Dark gray background with light gray text
    { id: 5, backgroundColor: '#333333', textColor: '#FFFFFF' }, // Dark gray background with white text
    { id: 6, backgroundColor: '#FFFFFF', textColor: '#333333' }, // White background with dark gray text
    { id: 7, backgroundColor: '#FFFF00', textColor: '#000000' }, // Yellow background with navy text
    { id: 8, backgroundColor: '#FFD700', textColor: '#2E8B57' }, // Gold background with sea green text
    { id: 11, backgroundColor: '#FFDAB9', textColor: '#4B0082' }, // Peach puff background with indigo text
    { id: 12, backgroundColor: '#E0FFFF', textColor: '#800000' }, // Light cyan background with maroon text
    { id: 13, backgroundColor: '#FAFAD2', textColor: '#2F4F4F' }, // Light goldenrod yellow background with dark slate gray text
    { id: 15, backgroundColor: '#FFE4B5', textColor: '#800080' }, // Moccasin background with purple text
    { id: 16, backgroundColor: 'hotpink', textColor: '#000000' }
    // Add more color pairs as needed...
];
export default function ColorPairs({ onClickHandler }) {
    const handleValueChange = (selectedPair) => {
        onClickHandler(selectedPair)
    };
    return (
        <React.Fragment>
            <div class="flex flex-wrap items-center justify-center sm:absolute sm:top-[135%]" title="Add text and select a quick colour combo for the lyrics">
                {COLOR_PAIRS.map(pair => {
                    return (
                        <div onClick={() => handleValueChange(pair)} key={pair.id} class="w-[150px] h-[50px] m-[5px] flex flex-col justify-center items-center font-bold" style={{ background: pair.backgroundColor, color: pair.textColor }}>
                            {pair.textColor}
                        </div>
                    )
                })}
            </div>
        </React.Fragment>
    )
}
