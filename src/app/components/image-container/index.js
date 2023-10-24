"use client"
import Image from 'next/image'
import React from 'react'
import { useSelector } from 'react-redux'

const ImageContainer = () => {
    const { content, artistsData } = useSelector((state) => state.linkSearch)
    const { artists } = artistsData
    const { images = [] } = content.album || {}
    if (images.length === 0) {
        return
    }
    return (
        <React.Fragment>
            <div className='flex justify-center flex-row item-center flex-wrap'>

                {
                    <Image src={images[0].url}
                        width={500}
                        height={500}
                        alt="Picture of the author" />
                }
                {
                    (artists || []).map(artist => {
                        const { images = [] } = (artist || {})
                        if (images && images.length != 0) {
                            console.log(images)
                            return (
                                <Image src={images[0].url}
                                className='m-[15px]'
                                    key={artist.id}
                                    width={500}
                                    height={500}
                                    alt="Picture of the author" />)
                        }
                    })
                }
            </div>
        </React.Fragment>
    )
}
export default ImageContainer