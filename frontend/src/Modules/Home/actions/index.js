import { createAsyncThunk } from '@reduxjs/toolkit';
import { FETCH_ACTIVE_LOBBIES, FETCH_LEADERBOARD } from "./actionTypes";
import { fetchLeaderboardReq, fetchActiveLobbiesReq } from "../../../API/game";

export const fetchLeaderboard = createAsyncThunk(
    FETCH_LEADERBOARD,
    async (count) => {
        const response = await fetchLeaderboardReq(count);
        return response.data;
    }
);

export const fetchActiveLobbies = createAsyncThunk(
    FETCH_ACTIVE_LOBBIES,
    async (count) => {
        const response = await fetchActiveLobbiesReq(count);
        return response.data;
    }
);