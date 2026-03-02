import { configureStore } from "@reduxjs/toolkit";
import searchReducer from '../features/searchSlice';
import likeReducer from '../features/likeSlice';

export const store = configureStore({
    reducer:{
        search:searchReducer,
        like:likeReducer,
    }
})