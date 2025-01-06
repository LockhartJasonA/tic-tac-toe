import { createSlice } from '@reduxjs/toolkit';

import { createUser } from './actions';

export const initialState = {
    loadingUser: true,
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(createUser.pending, (state) => {
                state.loadingUser = true;
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loadingUser = false;
            })
    },
});

export const { newUser } = userSlice.actions;
export default userSlice.reducer;