import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

function RequireLogIn({ children }) {
  const { isLogged } = useSelector((state) => state.userSlice);

  if (!isLogged === null) {
    return null;
  }

  if (isLogged === false) {
    return <Navigate to="/sign-in" />;
  }

  return <div>{children}</div>;
}

export default RequireLogIn;
