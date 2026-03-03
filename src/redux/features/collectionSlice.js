import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items:JSON.parse(localStorage.getItem('collections')) || [],
}

const collectionsSlice = createSlice({
    name:'collections',
    initialState:initialState,

    reducers:{
        addCollection:(state,action)=>{
           if (!action.payload) return;

           const alreadyExsist = state.items.find(
            item =>
              String(item?.id) === String(action.payload?.id) &&
              item?.src === action.payload?.src
           );

           if(!alreadyExsist){
            state.items.push(action.payload);
            localStorage.setItem('collections',JSON.stringify(state.items)) || [];
           }
        },
        removeCollection:(state,action)=>{
           state.items = state.items.filter(
            item => item.id !== action.payload
           )

           localStorage.setItem('collections',JSON.stringify(state.items)) || [];
        },
        clearCollection:(state,action)=>{
            state.items = [];
            localStorage.removeItem('collections');
        }
    }
})

export const  {
    addCollection,
    removeCollection,
    clearCollection
} = collectionsSlice.actions;

export default collectionsSlice.reducer;
