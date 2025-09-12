import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";

const PrivateRoute = () => {
  const { isLoggedIn, loading, user} = useAuth();
  console.log("PrivateRoute - Estados:", { isLoggedIn, loading, user });
  
  if (loading) {
    return <LoadingAnimation />; 
  }

  return isLoggedIn ? <Outlet /> : <Navigate to="/Login" />;
};

export default PrivateRoute;
