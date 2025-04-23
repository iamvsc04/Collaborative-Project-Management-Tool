import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks
export const fetchTeam = createAsyncThunk(
  "team/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/team");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to fetch team data");
    }
  }
);

export const addTeamMember = createAsyncThunk(
  "team/addMember",
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/team/members", memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Failed to add team member");
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
  members: [],
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
      // Fetch Team Members
      .addCase(fetchTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTeam.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Member
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.members.push(action.payload);
      })
      // Update Member
      .addCase(updateMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMember.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.members.findIndex(
          (member) => member._id === action.payload._id
        );
        if (index !== -1) {
          state.members[index] = action.payload;
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
        state.members = state.members.filter(
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
