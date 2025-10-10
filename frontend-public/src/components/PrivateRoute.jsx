import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";

const PrivateRoute = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <LoadingAnimation />;
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/elRinconcitoDeSharpays" />;
};

export default PrivateRoute;
