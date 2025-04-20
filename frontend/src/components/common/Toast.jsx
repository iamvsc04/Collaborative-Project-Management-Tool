import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";
import { clearError } from "../../store/slices/authSlice";

const Toast = () => {
  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.auth);

  const handleClose = () => {
    dispatch(clearError());
  };

  return (
    <Snackbar
      open={!!error}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  );
};

export default Toast; 