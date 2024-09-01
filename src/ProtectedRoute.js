import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ element: Component, ...rest }) {
  const isAuthenticated = sessionStorage.getItem("token");

  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" />;
}

export default ProtectedRoute;
