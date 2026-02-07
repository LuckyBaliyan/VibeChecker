import { fetchGifs } from "../api/mediaApi";
import React, { useEffect, useState } from 'react'

const ResultCard = () => {
  const [gifs,setGifs] = useState([]);

  const  loadItems = async ()=>{
    const data = await fetchGifs('cat',20);
    setGifs(data);
  };

 useEffect(()=>{
    loadItems();
 },[]);

 console.log(gifs);
 

  return (
    <div>
        <video
            key={gifs[1]?.id}
            src={gifs[1]?.images?.original?.mp4}
            muted
            autoPlay
            loop
            playsInline 
        />
    </div>
  )
}

export default ResultCard;