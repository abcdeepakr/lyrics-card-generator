"use client";
import React, { useEffect, useState } from "react";
import Image from 'next/image'
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import AddTextModal from '../add-text-modal';
import { Rnd } from "react-rnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Editor = () => {
  const router = useRouter();
  const [size, setSize] = useState({ width: 320, height: 320 })
  const [lyricPosition, setLyricPosition] = useState({ x: 50, y: 50 })
  const { content, artistsData } = useSelector((state) => state.linkSearch)
  const { lyricData = {} } = useSelector((state) => state)
  const [showAddTextModal, setShowAddTextModal] = useState(false)
  const { artists = [] } = artistsData
  const { images = [] } = content.album || {}
  const { name: trackName = "", artists: songArtists = [] } = content || {}
  const artistImages = artists.map(artist => {
    const { images = [] } = artist || {}
    if (images && images.length != 0) {
      return images[0]
    }
  })




  const allImages = [images[0], ...artistImages].filter(item => item != undefined)
  const [selectedImage, setSelectedimage] = useState(allImages[0]?.url)
  useEffect(() => {
    if (images.length === 0 && artists.length === 0) {
      router.push("/")
    }
  }, [images.length, artists.length])
  const onClickThumbnailHandler = (url) => {
    setSelectedimage(url)
  }
  const addTextHandler = () => {
    setShowAddTextModal(!showAddTextModal)
  }
  const notify = () => toast("lyric copied to clipboard");
  const onDoubleClickLyric = () => {
    navigator.clipboard.writeText(lyricData.lyric);
    notify()
    setShowAddTextModal(!showAddTextModal)
  }

  const allArtist = (songArtists || []).map((item) => item.name).join(", ")
  return (
    <React.Fragment>
      <div class="flex flex-row justify-between h-screen	">
        <div class="h-5/5 w-4/5 flex items-center justify-center flex-col">
          {selectedImage && <div id="finalImage" class="relative">
            <Image src={selectedImage}
              width={500}
              height={500}
              alt="selected image"
              class="object-cover object-center"
            />
            <div class="pl-2 absolute bottom-0 text-black bg-lime-300 w-full h-auto opacity-90">
              <p class="font-bold text-lg">{trackName}</p>
              <p class="font-medium text-sm">{allArtist}</p>
            </div>
            {lyricData.lyric &&
              <Rnd
                className={`active:border-2 active:border-white`}
                size={{ width: size.width, height: size.height }}
                position={{ x: lyricPosition.x, y: lyricPosition.y }}
                onDragStop={(e, d) => {
                  // setX(d.x);
                  // setY(d.y);
                  setLyricPosition({ x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setSize({ ...size, width: ref.style.width, height: ref.style.height });
                  // setSize({ ...size, height: ref.style.height });
                  // setHeight(ref.style.height);
                  setLyricPosition({ x: position.x, y: position.y });
                  // setX(position.x);
                  // setY(position.y);
                }}
              >
                <p
                  class="text-white text-left cursor-grab active:cursor-grabbing"
                  onDoubleClick={onDoubleClickLyric}
                  style={{
                    fontFamily: lyricData.fontFamily,
                    fontWeight: lyricData.fontWeight,
                    color: lyricData.fontColor,
                    width: "fit-content",
                    whiteSpace: 'pre-wrap',
                    fontSize: lyricData.fontSize + "px"
                  }}>
                  {lyricData.lyric?.split('\n').map((line, index) => (
                    <div style={{ backgroundColor: lyricData.backgroundColor }} class="mb-2 px-1" key={index}>{line}</div>
                  ))}
                </p>
              </Rnd>}
          </div>}
          <div>

            <button
              className="w-[80px] 
            h-[50px] 
            rounded-md py-1.5 font-bold
            text-lime-300
            outline-none
            ring-lime-600 
            ring-1	
            bg-black 
            m-2
            text-center	
            p-0
            border-0"
              onClick={() => addTextHandler()}>add text</button>


            {/* <button
              className="
            w-[100px] 
            h-[50px] 
            rounded-md py-1.5 font-bold
            text-lime-300
            outline-none
            ring-lime-600 
            ring-1	
            bg-black 
            m-2
            text-center	
            p-0
            border-0"
              onClick={() => downloadImageHandler()}>Download</button> */}
          </div>
        </div>
        <div class="flex flex-col flex-wrap right-0 w-0.5/5 h-screen items-center ">
          {
            allImages.map(image => {
              const { url = "" } = image || {}
              return (
                <Image src={url}
                  className='m-[15px]'
                  key={url}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                  onClick={() => onClickThumbnailHandler(url)}
                />)
            })
          }
        </div>
      </div>

      <div class="flex absolute top-11 left-11">
        {showAddTextModal && <AddTextModal onCloseCallback={addTextHandler} />}
      </div>
      <ToastContainer />

    </React.Fragment>
  );
}

export default Editor