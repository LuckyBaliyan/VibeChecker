import { fetchGifs } from "../api/mediaApi";
import React, { useEffect, useState } from 'react'

const ResultCard = () => {
  const [gifs,setGifs] = useState([]);

  const  loadItems = async ()=>{
    const data = await fetchGifs('Anime',20);
    setGifs(data);
  };

 useEffect(()=>{
    loadItems();
 },[]);

 console.log(gifs);
 

  return (
    <div>
        <video
            src={gifs[10]?.images?.original?.mp4}
            key={gifs[10]?.id}
            muted
            autoPlay
            loop
            playsInline 
        />
    </div>
  )
}

export default ResultCard;