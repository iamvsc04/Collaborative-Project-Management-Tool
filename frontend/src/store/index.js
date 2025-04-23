// src/store/index.js
import { configureStore } from "@reduxjs/toolkit";
import axiosInstance from "../utils/axios";

// Import reducers
import authReducer from "./slices/authSlice";
import projectReducer from "./slices/projectSlice";
import teamReducer from "./slices/teamSlice";
import messageReducer from "./slices/messageSlice";
import dashboardReducer from "./slices/dashboardSlice";
import themeReducer from "./slices/themeSlice";
import notificationReducer from "./slices/notificationSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectReducer,
    team: teamReducer,
    messages: messageReducer,
    dashboard: dashboardReducer,
    theme: themeReducer,
    notifications: notificationReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { axios: axiosInstance },
      },
      serializableCheck: false, // Disable serializable check for now
    }),
});

export default store;
