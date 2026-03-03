import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../features/searchSlice';
import likeReducer from '../features/likeSlice';
import collectionsReducer from "../features/collectionSlice";

export const store = configureStore({
    reducer:{
        search:searchReducer,
        like:likeReducer,
        collections:collectionsReducer,
    }
})