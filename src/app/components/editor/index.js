/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useEffect, useRef, useState } from "react";
import { toPng } from 'html-to-image';
import { useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import AddTextModal from '../add-text-modal';
import { Rnd } from "react-rnd";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateRandomString } from '../../utils/helpers/image-name-generator'

const Editor = () => {
  const router = useRouter();
  const [size, setSize] = useState({ width: 300, height: 250 });
  const [lyricPosition, setLyricPosition] = useState({ x: 50, y: 50 })
  const [showAddTextModal, setShowAddTextModal] = useState(false);
  const [fileDataURL, setFileDataURL] = useState([]);
  const [importedFiles, setImportedFiles] = useState([]);
  const { content, artistsData } = useSelector((state) => state.linkSearch);
  const { lyricData = {} } = useSelector((state) => state);
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
            border-0
            hover:bg-gray-600
            hover:opacity-0.9"
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
              onClick={() => downloadImageHandler("DOWNLOAD")}>Download</button>

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
              onClick={() => downloadImageHandler("COPY")}>Copy</button>
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