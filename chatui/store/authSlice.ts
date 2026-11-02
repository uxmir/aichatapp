import { getErrorMessage } from "../lib/errorcatch";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth } from "../types/auth";
import api from "../lib/api";

interface AuthService {
  auth: Auth | null;
  error: string | null;
  loading: boolean;
}

const initialState: AuthService = {
  auth: null,
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
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/auth/logout`);
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
  extraReducers: (builder) => {
    builder
      // Google Login Cases
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.auth = action.payload?.user || action.payload?.data || action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
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
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default authSlice.reducer;