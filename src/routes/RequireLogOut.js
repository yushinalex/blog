import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function RequireLogOut({ children }) {
  const { isLogged } = useSelector((state) => state.userSlice);

  if (isLogged) {
    return <Navigate to="/" />;
  }

  return <div>{children}</div>;
}

export default RequireLogOut;
