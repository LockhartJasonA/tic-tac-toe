import { createSlice } from '@reduxjs/toolkit';
import { fetchLeaderboard } from "./actions";

export const initialState = {
    loadingLeaderboard: true,
    leaderboard: []
};

export const homeSlice = createSlice({
    name: 'home',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLeaderboard.pending, (state) => {
                state.loadingLeaderboard = true;
            })
            .addCase(fetchLeaderboard.fulfilled, (state, action) => {
                state.leaderboard = action.payload;
                state.loadingLeaderboard = false;
            })
    },
});

export default homeSlice.reducer;