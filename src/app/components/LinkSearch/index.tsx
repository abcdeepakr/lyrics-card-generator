"use client";
import React, { useState } from "react";
import axios from "axios";
import { validateUrl } from "../../utils/helpers/validate-url";
import ImageContainer from "../image-container";
import { useDispatch } from "react-redux";
import { useRouter } from 'next/navigation'
import { toast,ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  linkSearchInitiated,
  linkSearchSuccess,
  artistSearchSuccess,
  searchError
} from "../../store/link-slice";

export default function Search() {
  const router = useRouter();
  const notify = (text: string) => toast(text);
  const [enteredUrl, setEnteredUrl] = useState("");
  const dispatch = useDispatch();
  const pasteLinkHandler = (e: any) => {
    setEnteredUrl(e.target.value);
  };
  const fetchSongData = async () => {
    dispatch(linkSearchInitiated())
    let trackId = "";
    if (validateUrl(enteredUrl)) {
      const url = new URL(enteredUrl);
      trackId = url.pathname.split("/").pop() || "";
    } else {
      window.alert("not a valid url");
      return;
    }
    const config = {
      method: "get",
      url: `/api/track?trackId=${trackId}`,
    };
    let trackData = await axios(config)
      .then((res) => {
        return res.data
      })
      .catch((err) => {
        return err
      });

    if(trackData.isError){
      notify("error occured :/")
      dispatch(searchError())
      return
    }
    if ((trackData || {}).album) {
      dispatch(linkSearchSuccess({ content: trackData || {}, trackId: trackId }));
    } else {
    }
    let artists = ""
    trackData?.artists?.map((item:any) =>{
      artists+=item.id+","
    })
    const artistData = {
      method: "get",
      url: `/api/artists?artists=${artists}`,
    };
    let artistsData = await axios(artistData)
      .then((res) => res.data)
      .catch((err) => err);
      dispatch(artistSearchSuccess({ artistsData }));
      router.push("/editor")
  };
  return (
    <React.Fragment>
      <div className={`h-[30vh] w-[100%] flex justify-center items-center`}>
        <h1
          className={`w-[100%] text-center font-bold tracking-tight text-lime-300 text-6xl sm:text-5xl`}>
          Generate Lyric Cards
        </h1>
      </div>
      <div className="w-[100%] flex flex-col justify-center items-center m-auto">
        <div className="w-[100%] flex justify-center items-center m-auto sm:flex-col	">
          <input
            type="text"
            name="price"
            id="price"
            className="block 
                  w-[50%] 
                  h-[50px]
                  rounded-md 
                  border-0 
                  py-1.5 pl-7
                  text-lime-300 ring-1 
                  font-bold
                  outline-none
                  ring-lime-600	
                  placeholder:text-lime-400 
                  text-base	
                  sm:leading-6
                  bg-black
                  text-center

                  sm:w-4/5
                  sm:pl-2

                  "
            placeholder="Paste song link"
            onChange={(e) => pasteLinkHandler(e)}
          />
          <div>
            <button
              onClick={fetchSongData}
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
                      border-0">
              Start
            </button>
          </div>
        </div>
        <ImageContainer />
      </div>
      <ToastContainer/>
    </React.Fragment>
  );
}
