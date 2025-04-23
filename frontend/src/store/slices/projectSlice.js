import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";

// Async thunks
export const fetchProjects = createAsyncThunk(
  "projects/fetchProjects",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/projects");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch projects"
      );
    }
  }
);

export const fetchProjectById = createAsyncThunk(
  "projects/fetchProjectById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("Starting to fetch project with ID:", id);
      if (!id) {
        throw new Error("Project ID is required");
      }

      const response = await axios.get(`/projects/${id}`);
      console.log("Project fetch response:", response.data);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to fetch project");
      }

      return response.data.data;
    } catch (error) {
      console.error("Error fetching project:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch project"
      );
    }
  }
);

export const createProject = createAsyncThunk(
  "projects/createProject",
  async (projectData, { rejectWithValue, getState }) => {
    try {
      // Get the current user from the auth state
      const { user } = getState().auth;

      if (!user) {
        throw new Error("User not authenticated");
      }

      // Add the current user as the owner and a member
      const projectWithUser = {
        ...projectData,
        owner: user._id,
        members: [user._id],
      };

      console.log("Creating project with data:", projectWithUser);
      const response = await axios.post("/projects", projectWithUser);
      console.log("Project created successfully:", response.data);
      return response.data.data;
    } catch (error) {
      console.error("Error creating project:", error.response?.data || error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to create project"
      );
    }
  }
);

export const updateProject = createAsyncThunk(
  "projects/updateProject",
  async ({ id, ...projectData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/projects/${id}`, projectData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update project"
      );
    }
  }
);

export const deleteProject = createAsyncThunk(
  "projects/deleteProject",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/projects/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete project"
      );
    }
  }
);

export const joinProject = createAsyncThunk(
  "projects/joinProject",
  async (projectId, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;
      if (!user) {
        throw new Error("User not authenticated");
      }

      const response = await axios.post(`/projects/${projectId}/join`, {
        userId: user._id,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to join project"
      );
    }
  }
);

export const getUserProjects = createAsyncThunk(
  "projects/getUserProjects",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { user } = getState().auth;

      if (!user || !user._id) {
        console.error("User not authenticated or user ID not available");
        return rejectWithValue("User not authenticated");
      }

      console.log("Fetching projects for user:", user._id);
      const response = await axios.get(`/projects/user/${user._id}`);
      return response.data.data;
    } catch (error) {
      console.error("Error fetching user projects:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user projects"
      );
    }
  }
);

export const addMember = createAsyncThunk(
  "projects/addMember",
  async ({ projectId, email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/projects/${projectId}/members`, {
        email,
      });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add member"
      );
    }
  }
);

export const removeMember = createAsyncThunk(
  "projects/removeMember",
  async ({ projectId, memberId }, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `/projects/${projectId}/members/${memberId}`
      );
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove member"
      );
    }
  }
);

const initialState = {
  projects: [],
  currentProject: null,
  loading: false,
  error: null,
  success: null,
};

const projectSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    setCurrentProject: (state, action) => {
      state.currentProject = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Project by ID
      .addCase(fetchProjectById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjectById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProject = action.payload;
        state.error = null;
      })
      .addCase(fetchProjectById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.success = "Project created successfully";
        state.error = null;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = null;
      })
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.projects.findIndex(
          (project) => project._id === action.payload._id
        );
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
        if (state.currentProject?._id === action.payload._id) {
          state.currentProject = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(
          (project) => project._id !== action.payload
        );
        if (state.currentProject?._id === action.payload) {
          state.currentProject = null;
        }
        state.error = null;
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Join Project
      .addCase(joinProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
        state.error = null;
      })
      .addCase(joinProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get User Projects
      .addCase(getUserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
        state.error = null;
      })
      .addCase(getUserProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add Member
      .addCase(addMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProject) {
          state.currentProject.members = action.payload.members;
        }
        state.error = null;
      })
      .addCase(addMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove Member
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        if (state.currentProject) {
          state.currentProject.members = action.payload.members;
        }
        state.error = null;
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccess, setCurrentProject } =
  projectSlice.actions;
export default projectSlice.reducer;
