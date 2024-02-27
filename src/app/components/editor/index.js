"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import { toPng } from 'html-to-image';
import NextImage from 'next/image'
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import AddTextModal from '../add-text-modal';
import { Rnd } from "react-rnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateRandomString } from '../../utils/helpers/image-name-generator'

const Editor = () => {
  const router = useRouter();
  const [size, setSize] = useState({ width: 320, height: 320 })
  const [lyricPosition, setLyricPosition] = useState({ x: 50, y: 50 })
  const [showAddTextModal, setShowAddTextModal] = useState(false)
  const [fileDataURL, setFileDataURL] = useState([]);
  const [importedFiles, setImportedFiles] = useState([]);
  const { content, artistsData } = useSelector((state) => state.linkSearch)
  const { lyricData = {} } = useSelector((state) => state)
  const imageRef = useRef(null)

  const { artists = [] } = artistsData
  const { images = [] } = content.album || {}
  const { name: trackName = "", artists: songArtists = [] } = content || {}
  const artistImages = artists.map(artist => {
    const { images = [] } = artist || {}
    if (images && images.length != 0) {
      return images[0]
    }
  })

  // const downloadImageHandler = async () => {
  //   console.log("document.getElementById('finalImage')", document.getElementById('finalImage'))
  //   htmlToImage.toJpeg(document.getElementById('finalImage'), { quality: 1 })
  //     .then(function (dataUrl) {
  //       console.log("dataUrl", dataUrl)
  //       var link = document.createElement('a');
  //       link.download = generateRandomString();
  //       link.href = dataUrl;
  //       link.click();
  //     });
  // };



  const allImages = [images[0], ...artistImages].filter(item => item != undefined)
  const [selectedImage, setSelectedimage] = useState(allImages[0]?.url)

  const downloadImageHandler = () => {
    if (imageRef.current === null) {
      return
    }
    toPng(imageRef.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement('a');
        link.download = generateRandomString();
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        // console.log(err);
      });
  }
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
  const notify = (text) => toast(text);
  const onDoubleClickLyric = () => {
    navigator.clipboard.writeText(lyricData.lyric);
    notify("lyric copied to clipboard")
    setShowAddTextModal(!showAddTextModal)
  }
  const onImageImportHandler = (e) => {
    setImportedFiles(e.target.files);
  }

  useEffect(() => {
    if (importedFiles.length) {
      Object.keys(importedFiles).forEach(item => {
        let fileReader, isCancel = false;
        var fileSize = importedFiles[item].size; // size in bytes        
        var maxSize = 1024 * 1024; // 1 MB = 1024 * 1024 bytes

        if (fileSize > maxSize) {
          notify("File size limit is 1MB");
          return;
        }

        fileReader = new FileReader();
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result && !isCancel) {
            setFileDataURL(prevState => [...prevState, result]); // Update state here
          }
        };
        fileReader.readAsDataURL(importedFiles[item]);
        return () => {
          isCancel = true;
          if (fileReader && fileReader.readyState === 1) {
            fileReader.abort();
          }
        };
      });
    }
  }, [importedFiles]);
  const allArtist = (songArtists || []).map((item) => item.name).join(", ")
  return (
    <React.Fragment>
      <div class="flex flex-row justify-between h-screen	">
        <div class="h-5/5 w-4/5 flex items-center justify-center flex-col">
          {selectedImage && <div ref={imageRef} class="relative">
            <img src={selectedImage}
              key={selectedImage}
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


            <button
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
              onClick={() => downloadImageHandler()}>Download</button>
          </div>
        </div>
        <div class="flex flex-col overflow-scroll right-0 w-0.5/5 h-screen items-center ">
          {fileDataURL.length ? fileDataURL.map(url => {
            return (
              <img src={url}
                className='m-[15px]'
                key={url}
                width={100}
                height={100}
                alt="Picture of the author"
                onClick={() => onClickThumbnailHandler(url)}
              />
            )
          }) : null}
          {
            allImages.map(image => {
              const { url = "" } = image || {}
              return (
                <img src={url}
                  className='m-[15px]'
                  key={url}
                  width={100}
                  height={100}
                  alt="Picture of the author"
                  onClick={() => onClickThumbnailHandler(url)}
                />)
            })
          }
          <div class="flex items-center justify-center w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-[100px] h-[100px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600 mt-2">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
              </div>
              <input id="dropzone-file" type="file" accept="image/*" class="hidden" onChange={onImageImportHandler} multiple />
            </label>
          </div>


        </div>
      </div>

      <div class="flex absolute top-11 left-[500px]">
        {showAddTextModal && <AddTextModal onCloseCallback={addTextHandler} />}
      </div>
      <ToastContainer />

    </React.Fragment>
  );
}

export default Editor