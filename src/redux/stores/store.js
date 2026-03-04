import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../features/searchSlice';
import likeReducer from '../features/likeSlice';
import collectionsReducer from "../features/collectionSlice";
import { apiSlice } from '../queries/apiSlice';

export const store = configureStore({
    reducer:{
        search:searchReducer,
        like:likeReducer,
        collections:collectionsReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
    }
    ,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(apiSlice.middleware),
})
