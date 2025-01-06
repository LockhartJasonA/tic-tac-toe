import { createAsyncThunk } from '@reduxjs/toolkit';
import { CREATE_USER } from "./actionTypes";
import { createUserReq } from "../../../API/user";

export const createUser = createAsyncThunk(
    CREATE_USER,
    async (parameters) => {
        const response = await createUserReq(parameters);
        return response.data;
    }
);