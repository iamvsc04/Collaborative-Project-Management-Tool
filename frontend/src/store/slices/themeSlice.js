// src/store/slices/themeSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Check if there's a saved theme preference in localStorage
const getInitialTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  // Return saved preference or check for system preference
  if (savedTheme) {
    return savedTheme === "dark";
  }
  // Check for system dark mode preference as fallback
  return (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
};

const themeSlice = createSlice({
  name: "theme",
  initialState: {
    darkMode: getInitialTheme(),
  },
  reducers: {
    toggleTheme: (state) => {
      state.darkMode = !state.darkMode;
      // Save to localStorage for persistence
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
    setDarkMode: (state, action) => {
      state.darkMode = action.payload;
      localStorage.setItem("theme", state.darkMode ? "dark" : "light");
    },
  },
});

export const { toggleTheme, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;
