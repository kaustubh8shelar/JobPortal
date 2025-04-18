import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Skeleton } from '@mui/material';

const DelayedRoute = ({ delay = 500 }) => {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return ready ? <Outlet /> : <ShimmerPlaceholder />;
};

const ShimmerPlaceholder = () => (
  <Box p={3}>
    <Skeleton variant="text" width="60%" height={40} />
    <Skeleton variant="rectangular" height={300} sx={{ my: 2 }} />
    <Skeleton variant="text" width="40%" />
    <Skeleton variant="text" width="80%" />
    <Skeleton variant="rectangular" height={200} sx={{ my: 2 }} />
  </Box>
);

export default DelayedRoute;
