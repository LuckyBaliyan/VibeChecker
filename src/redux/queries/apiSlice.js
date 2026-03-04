import { createApi, fakeBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAssets, fetchGifs, fetchVideos } from '../../api/mediaApi';

const getErrorPayload = (error) => ({
  status: error?.response?.status || 'FETCH_ERROR',
  data: error?.response?.data || error?.message || 'Failed to fetch media',
});

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  endpoints: (builder) => ({
    getPhotos: builder.query({
      async queryFn(query) {
        const trimmed = query?.trim?.() || '';
        if (!trimmed) return { data: [] };

        try {
          const data = await fetchAssets(trimmed);
          return { data };
        } catch (error) {
          return { error: getErrorPayload(error) };
        }
      },
      keepUnusedDataFor: 60,
    }),
    getGifs: builder.query({
      async queryFn(query) {
        const trimmed = query?.trim?.() || '';
        if (!trimmed) return { data: [] };

        try {
          const data = await fetchGifs(trimmed);
          return { data };
        } catch (error) {
          return { error: getErrorPayload(error) };
        }
      },
      keepUnusedDataFor: 60,
    }),
    getVideos: builder.query({
      async queryFn(query) {
        const trimmed = query?.trim?.() || '';
        if (!trimmed) return { data: [] };

        try {
          const data = await fetchVideos(trimmed);
          return { data };
        } catch (error) {
          return { error: getErrorPayload(error) };
        }
      },
      keepUnusedDataFor: 60,
    }),
  }),
});

export const { useGetPhotosQuery, useGetGifsQuery, useGetVideosQuery } = apiSlice;
