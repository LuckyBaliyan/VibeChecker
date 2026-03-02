import { createSlice } from "@reduxjs/toolkit";

//get the already liked items form localStorage

const getInitialLikes = () => {
    const storedLikes = localStorage.getItem("likedItems");
    if (storedLikes) {
        try {
            return JSON.parse(storedLikes);
        } catch {
            return [];
        }
    }
    return [];
};

const likeSlice = createSlice({
    name:'like',
    initialState:{
        likedItems:getInitialLikes(),
    },
    reducers:{
        toggleLikes:(state,action)=>{
            const item = action.payload;

            const likedIndex = state.likedItems.findIndex(
                (liked)=>liked.id == item.id
            );

            if(likedIndex == -1){
               state.likedItems.push(item);
            }
            else  state.likedItems.splice(likedIndex,1); 

            //store to the localStorage
            localStorage.setItem(
                "likedItems",
                JSON.stringify(state.likedItems)
            );
        },
        
        clearLikes:(state)=>{
            state.likedItems = [];
            localStorage.removeItem("likedItems");
        }
    }
})

export const {toggleLikes,clearLikes} = likeSlice.actions;
export default likeSlice.reducer;