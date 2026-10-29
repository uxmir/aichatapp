import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { getErrorMessage } from "@/lib/errorcatch";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers: {
    "Content-Type": "application/json",
  },
});

interface ChatState {
  sessions: any[];       
  currentSession: any;   
  error: string | null;
  loading: boolean;
}

const initialState: ChatState = {
  sessions: [],
  currentSession: null,
  error: null,
  loading: false,
};

// 1. Create chat 
export const createChat = createAsyncThunk(
  "chat/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v2/chat/create", payload);
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// 2. Find specific session chat 
export const findSessionChat = createAsyncThunk(
  "chat/findSession",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v2/chat/get/${id}`);
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// 3. Find all session titles for sidebar 
export const findSessionTitle = createAsyncThunk(
  "chat/findTitle",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v2/chat/get/title");
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// 4. Update session title
export const sessionTitleUpdate = createAsyncThunk(
  "chat/updateTitle",
  async (
    { id, payload }: { id: string; payload: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/api/v2/chat/update/${id}`, payload);
      return response?.data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

// 5. Delete AI session 
export const aiSessionDelete = createAsyncThunk(
  "chat/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v2/chat/delete/${id}`);
      return { id, data: response?.data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  },
);

const chatSlice = createSlice({
  initialState,
  name: "chat",
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Create Chat ---
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const newSession = action?.payload?.data || action?.payload;
        state.currentSession = newSession;
        const exists = state.sessions.some((s) => s._id === newSession._id);
        if (!exists) {
          state.sessions = [newSession, ...state.sessions];
        } else {
          state.sessions = state.sessions.map((s) => 
            s._id === newSession._id ? newSession : s
          );
        }
        state.error = null;
      })
      .addCase(createChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // --- Find Specific Chat Session ---
      .addCase(findSessionChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findSessionChat.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentSession = action?.payload?.data || action?.payload;
        state.error = null;
      })
      .addCase(findSessionChat.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action?.payload as string;
      })

      // --- Find Session Titles (Sidebar) ---
      .addCase(findSessionTitle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(findSessionTitle.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.sessions = action?.payload?.data || action?.payload;
        state.error = null;
      })
      .addCase(findSessionTitle.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action?.payload as string;
      })

      // --- Update Session Title ---
      .addCase(sessionTitleUpdate.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sessionTitleUpdate.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const updated = action?.payload?.data || action?.payload;
        state.sessions = state.sessions.map((s) =>
          s._id === updated._id ? { ...s, title: updated.title } : s
        );
        if (state.currentSession && state.currentSession._id === updated._id) {
          state.currentSession.title = updated.title;
        }
        state.error = null;
      })
      .addCase(sessionTitleUpdate.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action?.payload as string;
      })

      // --- Delete AI Session ---
      .addCase(aiSessionDelete.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(aiSessionDelete.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        const deletedId = action.payload.id;
        state.sessions = state.sessions.filter((s) => s._id !== deletedId);
        if (state.currentSession && state.currentSession._id === deletedId) {
          state.currentSession = null;
        }
        state.error = null;
      })
      .addCase(aiSessionDelete.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action?.payload as string;
      });
  },
});

export default chatSlice.reducer;






















