import axios from "axios";

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const GIPHY_KEY = import.meta.env.VITE_GIPHY_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY;

export async function fetchAssets(query="",page=1,per_page=20){
    const res = await axios.get('https://api.unsplash.com/search/photos',{
        params:{query,page,per_page}, //use for what and how much to fetch usually like query
        headers:{Authorization:`Client-ID ${UNSPLASH_KEY}`} // use for the user api key
    });
    console.log(res.data.results);
    // fetch total 10000 but give us 20 results in the data key of the response object
}

export async function fetchGifs(query,limit=10) {
   try{
     const res = await axios.get('https://api.giphy.com/v1/gifs/search',{
        params:{
            q:query,
            api_key:GIPHY_KEY,
            limit:limit
        },
    });
    console.log(res.data.data);
    return res.data.data || [];
   }
   catch(error){
    console.log(error.response?.data);
   }
}

export async function fetchVideos(query="",per_page=15){
    const res = await axios.get('https://api.pexels.com/videos/search',{
        params:{query,per_page}, //use for what and how much to fetch usually like query
        headers:{Authorization:PEXELS_KEY} // use for the user api key
    });
    console.log(res.data.videos);
    // fetch total 10000 but give us 20 results in the data key of the response object
}