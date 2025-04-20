import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getCurrentUser } from '../../store/slices/authSlice';
import { CircularProgress, Box } from '@mui/material';

const PrivateRoute = () => {
  const { isAuthenticated, loading, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (token && !isAuthenticated && !loading) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated, loading]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute; 