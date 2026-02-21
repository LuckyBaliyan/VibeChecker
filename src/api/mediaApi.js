import axios from 'axios';

const UNSPLASH_KEY = import.meta.env.VITE_UNSPLASH_KEY;
const GIPHY_KEY = import.meta.env.VITE_GIPHY_KEY;
const PEXELS_KEY = import.meta.env.VITE_PEXELS_KEY;

const safeTitle = (value, fallback) => (value && value.trim() ? value : fallback);

const normalizePhoto = (item) => ({
  id: item.id,
  src: item.urls?.regular || item.urls?.full || '',
  thumbnail: item.urls?.small || item.urls?.thumb || '',
  title: safeTitle(item.alt_description || item.description || '', 'Photo'),
  type: 'photo',
});

const normalizeGif = (item) => ({
  id: item.id,
  src:
    item.images?.original?.mp4 ||
    item.images?.original_mp4?.mp4 ||
    item.images?.downsized_medium?.mp4 ||
    item.images?.downsized?.mp4 ||
    item.images?.preview?.mp4 ||
    item.images?.original?.url ||
    '',
  thumbnail:
    item.images?.fixed_width_still?.url ||
    item.images?.downsized_still?.url ||
    item.images?.preview_gif?.url ||
    '',
  title: safeTitle(item.title || '', 'GIF'),
  type: 'gif',
});

const normalizeVideo = (item) => {
  const bestFile = item.video_files?.[0];

  return {
    id: item.id,
    src: bestFile?.link || '',
    thumbnail: item.image || '',
    title: safeTitle(item.user?.name || '', 'Video'),
    type: 'video',
  };
};

export async function fetchAssets(query = '', page = 1, per_page = 30) {
  try {
    const res = await axios.get('https://api.unsplash.com/search/photos', {
      params: { query, page, per_page },
      headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` },
    });

    const data =  (res.data?.results || []).map(normalizePhoto);

    return data;
  } catch (error) {
    console.log(error.response?.data || error.message);
    return [];
  }
}

export async function fetchGifs(query = '', limit = 50) {
  try {
    const res = await axios.get('https://api.giphy.com/v1/gifs/search', {
      params: {
        q: query,
        api_key: GIPHY_KEY,
        limit,
      },
    });

    return (res.data?.data || []).map(normalizeGif);
  } catch (error) {
    console.log(error.response?.data || error.message);
    return [];
  }
}

export async function fetchVideos(query = '', per_page = 25) {
  try {
    const res = await axios.get('https://api.pexels.com/videos/search', {
      params: { query, per_page },
      headers: { Authorization: PEXELS_KEY },
    });

    return (res.data?.videos || []).map(normalizeVideo);
  } catch (error) {
    console.log(error.response?.data || error.message);
    return [];
  }
}
