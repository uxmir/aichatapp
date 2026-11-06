import { getErrorMessage } from "../lib/errorcatch";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../types/auth";
import api from "../lib/api";
import Cookies from "js-cookie";

interface AuthService {
  auth: Auth | null;
  accessToken: string | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthService = {
  auth: null,
  accessToken: null,
  error: null,
  loading: false,
};
export const refresh = createAsyncThunk(
  "auth/refresh",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/auth/refresh-token"); 
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);
export const findMe = createAsyncThunk(
  "auth/findMe",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/auth/get-me");
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/auth/logout`);
      return response?.data;
    } catch (error: any) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    clearAuth: (state) => {
      state.auth = null;
      state.accessToken = null;
      Cookies.remove("accessToken");
    }
  },
  extraReducers: (builder) => {
    builder
      // Refresh Token Cases
      .addCase(refresh.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(refresh.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload?.data?.accessToken || action.payload?.accessToken;
      })
      .addCase(refresh.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.auth = null;
        state.accessToken = null;
      })

      // Find Me Cases (/get-me)
      .addCase(findMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findMe.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload?.data || action.payload;
      })
      .addCase(findMe.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Logout Cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.auth = null;
        state.accessToken = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setAccessToken, clearAuth } = authSlice.actions;
export default authSlice.reducer;