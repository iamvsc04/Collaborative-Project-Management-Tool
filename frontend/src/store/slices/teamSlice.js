import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks
export const fetchTeam = createAsyncThunk(
  "team/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("/api/team");
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Error fetching team");
    }
  }
);

export const addMember = createAsyncThunk(
  "team/addMember",
  async (memberData, { rejectWithValue }) => {
    try {
      const res = await axios.post("/api/team", memberData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || "Error adding member");
    }
  }
);

export const updateMember = createAsyncThunk(
  "team/updateMember",
  async ({ id, ...memberData }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`/api/team/${id}`, memberData);
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Error updating member"
      );
    }
  }
);

export const removeMember = createAsyncThunk(
  "team/removeMember",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/team/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.msg || "Error removing member"
      );
    }
  }
);

const initialState = {
  team: [],
  loading: false,
  error: null,
};

const teamSlice = createSlice({
  name: "team",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Team
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.team = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Member
      .addCase(addMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        state.team.push(action.payload);
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Member
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.team.findIndex(
          (member) => member._id === action.payload._id
        );
        if (index !== -1) {
          state.team[index] = action.payload;
        }
      })
      .addCase(updateMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Member
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        state.team = state.team.filter(
          (member) => member._id !== action.payload
        );
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
