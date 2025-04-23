import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks
export const fetchTeam = createAsyncThunk(
  "team/fetchTeam",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/team");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch team data");
    }
  }
);

export const addTeamMember = createAsyncThunk(
  "team/addMember",
  async (memberData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/team", memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to add team member");
    }
  }
);

export const updateMember = createAsyncThunk(
  "team/updateMember",
  async ({ id, ...memberData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/team/${id}`, memberData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to update member");
    }
  }
);

export const removeMember = createAsyncThunk(
  "team/removeMember",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/team/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to remove member");
    }
  }
);

export const joinTeam = createAsyncThunk(
  "team/joinTeam",
  async (projectName, { rejectWithValue }) => {
    try {
      const response = await axios.post("/team/join", { projectName });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to join team");
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
      .addCase(addTeamMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addTeamMember.fulfilled, (state, action) => {
        state.loading = false;
        state.members.push(action.payload);
      })
      .addCase(addTeamMember.rejected, (state, action) => {
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
      })
      // Join Team
      .addCase(joinTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinTeam.fulfilled, (state, action) => {
        state.loading = false;
        // Refresh team members after joining
        state.members = action.payload.members;
      })
      .addCase(joinTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;
