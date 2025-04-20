// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/taskSlice";
import teamReducer from "./slices/teamSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    tasks: taskReducer,
    team: teamReducer,
    theme: themeReducer,
  },
});
