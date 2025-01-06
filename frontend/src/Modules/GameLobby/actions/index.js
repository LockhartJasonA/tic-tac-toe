import { createAsyncThunk } from '@reduxjs/toolkit';
import { CREATE_GAME, JOIN_GAME, LEAVE_GAME, MAKE_MOVE } from "./actionTypes";
import { createGameReq, updateGameReq } from "../../../API/game";

export const createGameAction = createAsyncThunk(
    CREATE_GAME,
    async (parameters) => {
        const response = await createGameReq(parameters);
        return response.data;
    }
);

export const joinGameAction = createAsyncThunk(
    JOIN_GAME,
    async ({ gameId, parameters }) => {
        const response = await updateGameReq(gameId, parameters);
        return response.data;
    }
);

export const leaveGameAction = createAsyncThunk(
    LEAVE_GAME,
    async ({ gameId, parameters }) => {
        const response = await updateGameReq(gameId, parameters);
        return response.data;
    }
);

export const makeMoveAction = createAsyncThunk(
    MAKE_MOVE,
    async ({ gameId, parameters }) => {
        const response = await updateGameReq(gameId, parameters);
        return response.data;
    }
);