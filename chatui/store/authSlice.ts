import { getErrorMessage } from "../lib/errorcatch";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../types/auth";
import api from "../lib/api";
interface AuthService {
  auth: Auth[];
  error: string | null;
  loading: boolean;
}

const initialState: AuthService = {
  auth: [],
  error: null,
  loading: false,
};

export const googleLogin = createAsyncThunk(
  "auth/login",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/auth/google/callback");
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
export const logout = createAsyncThunk(
  "auth/logout",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/auth/logout/${id}`);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);
const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {},
  extraReducers: (builder) => {},
});

export default authSlice.reducer;
