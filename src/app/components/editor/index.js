/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { toPng } from 'html-to-image';
import { useSelector, useDispatch } from "react-redux";
import { useRouter } from 'next/navigation';
import AddTextModal from '../add-text-modal';
import { Rnd } from "react-rnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateRandomString } from '../../utils/helpers/image-name-generator'
import ColorPairs from './color-pairs';
import {
  saveLyrics
} from "../../store/lyrics-slice";
const Editor = () => {
  const router = useRouter();
  const { content, artistsData } = useSelector((state) => state.linkSearch);
  const { lyricData = {} } = useSelector((state) => state);
  const dispatch = useDispatch();
  const [size, setSize] = useState({ width: 300, height: 250 });
  const [lyricPosition, setLyricPosition] = useState({ x: 50, y: 50 })
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [fileDataURL, setFileDataURL] = useState([]);
  const [importedFiles, setImportedFiles] = useState([]);
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

  const updateQuickColorHandler = (selectedData) => {
    dispatch(saveLyrics({ ...lyricData, fontColor: selectedData.textColor, backgroundColor: selectedData.backgroundColor }));
  }

  const allImages = [images[0], ...artistImages].filter(item => item != undefined)
  const [selectedImage, setSelectedimage] = useState(allImages[0]?.url)
  const [showPageLoader, setShowPageLoader] = useState(true)

  useEffect(() => {
    if (allImages.length) {
      setShowPageLoader(false)
    }
  }, [allImages])
  const notify = (text) => toast(text);
  const downloadImageHandler = (action) => {
    if (imageRef.current === null) {
      return
    }
    toPng(imageRef.current, { cacheBust: true })
      .then(async (dataUrl) => {
        // console.log(dataUrl)
        const link = document.createElement('a');
        link.download = generateRandomString();
        link.href = dataUrl;
        let blob = await fetch(dataUrl).then(r => r.blob());
        switch (action) {
          case "DOWNLOAD": {
            link.click()
            return
          };
          case "COPY": {
            navigator.clipboard.write([
              new ClipboardItem({
                'image/png': blob
              })
            ]);
            notify("copied to clipboard")
            return
          };
          default: {
            link.click()
            return
          };
        };
      })
      .catch((err) => {
        return err;
      });
  }
  const onClickThumbnailHandler = (url) => {
    setSelectedimage(url)
  }
  const addTextHandler = () => {
    setShowAddTextModal(!showAddTextModal)
  }
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

  if (!allImages.length) {
    setTimeout(() => {
      setShowPageLoader(false)
      router.push('/')
    }, 2500)
    return showPageLoader &&
      <div role="status" class="flex justify-center items-center h-[100vh]">
        <svg aria-hidden="true" class="w-8 h-8 text-black animate-spin dark:text-gray-600 fill-lime-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>
  }

  return (
    <React.Fragment>
      <div class="flex flex-row justify-between h-screen sm:flex-col sm:h-auto">
        <div class="h-5/5 w-4/5 flex items-center justify-center flex-col sm:w-full sm:relative">
          {selectedImage && 
          <div ref={imageRef} class="relative bg-black">
            <img src={selectedImage}
              key={selectedImage}
              width={500}
              height={500}
              alt="selected image"
              class="object-cover object-center opacity-50"
              onDoubleClick={addTextHandler}
            />
            <div class="pl-2 absolute bottom-0 text-black bg-lime-300 w-full h-auto opacity-90">
              <p class="font-bold text-lg">{trackName}</p>
              <p class="font-medium text-sm">{allArtist}</p>
            </div>
            {lyricData.lyric &&
              <Rnd
                className={`hover:border-2 hover:border-white`}
                size={{ width: size.width, height: size.height }}
                position={{ x: lyricPosition.x, y: lyricPosition.y }}
                onDragStop={(e, d) => {
                  // setX(d.x);
                  // setY(d.y);
                  setLyricPosition({ x: d.x, y: d.y });
                }}
                onResizeStop={(e, direction, ref, delta, position) => {
                  setSize({ ...size, width: ref.style.width, height: ref.style.height });
                  setLyricPosition({ x: position.x, y: position.y });
                }}
                maxWidth={500} // Set maximum width of the container
                maxHeight={500} // Set maximum height of the cont
                cancel="cancel"
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
                    <div style={{ backgroundColor: lyricData.backgroundColor }} class="mb-2 px-1 w-fit" key={index}>{line}</div>
                  ))}
                </p>
              </Rnd>}
          </div>}
          <div class="flex flex-row">
            <button
              class="flex justify-center items-center  w-[50px] h-[50px]
            rounded-full py-1.5 font-bold
            text-lime-300
            outline-none
            ring-lime-600 
            ring-1	
            bg-black 
            m-2
            text-center	
            p-0
            border-2
            border-text-lime-300
            hover:bg-gray-600
            hover:opacity-0.9"
              onClick={() => addTextHandler()}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
              </button>
            <button
              class="
            py-1.5 font-bold
            text-lime-300
            outline-none
            ring-lime-600 
            ring-1	
            bg-black 
            m-2
            text-center	
            p-0
            border-2
            border-text-lime-300
            rounded-full
            flex justify-center items-center  w-[50px] h-[50px]"
              onClick={() => downloadImageHandler("DOWNLOAD")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>

              </button>
            <button
              class="
            flex justify-center items-center  w-[50px] h-[50px] 
            rounded-full py-1.5 font-bold
            text-lime-300
            border-text-lime-300
            outline-none
            ring-lime-600 
            ring-1	
            bg-black 
            m-2
            text-center	
            p-0
            border-2"
              onClick={() => downloadImageHandler("COPY")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5V6.108c0-1.135.845-2.098 1.976-2.192.373-.03.748-.057 1.123-.08M15.75 18H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08M15.75 18.75v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5A3.375 3.375 0 0 0 6.375 7.5H5.25m11.9-3.664A2.251 2.251 0 0 0 15 2.25h-1.5a2.251 2.251 0 0 0-2.15 1.586m5.8 0c.065.21.1.433.1.664v.75h-6V4.5c0-.231.035-.454.1-.664M6.75 7.5H4.875c-.621 0-1.125.504-1.125 1.125v12c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V16.5a9 9 0 0 0-9-9Z" />
                </svg>
              </button>
          </div>
          {/* TODO:add  */}
          <ColorPairs onClickHandler={updateQuickColorHandler} />
        </div>
        <div class="flex flex-col overflow-scroll right-0 w-0.5/5 h-screen items-center sm:flex-row sm:h-auto">

          {/* select image div */}
          <div class="flex items-center justify-center md:w-full">
            <label for="dropzone-file" class="flex flex-col items-center justify-center w-[100px] h-[100px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer dark:hover:bg-bray-800 bg-gray-700 hover:bg-gray-100 ">
              <div class="flex flex-col items-center justify-center pt-5 pb-6">
                <svg class="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                </svg>
                <p class="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
              </div>
              <input id="dropzone-file" type="file" accept="image/*" class="hidden" onChange={onImageImportHandler} multiple />
            </label>
          </div>
          {fileDataURL.length ? fileDataURL.map(url => {
            return (
              <img src={url}
                class='m-[15px] sm:m-[5px]'
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
                  class='m-[15px] sm:m-[5px]'
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

      <div class="flex absolute top-11 left-[500px] sm:top-0 sm:left-0">
        {showAddTextModal && <AddTextModal onCloseCallback={addTextHandler} />}
      </div>
      <ToastContainer />
      {showPageLoader && <div role="status">
        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-lime-300" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span class="sr-only">Loading...</span>
      </div>}
    </React.Fragment>
  );
}

export default Editor