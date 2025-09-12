import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import LoadingAnimation from "../components/LoadingAnimation.jsx";

const PrivateRoute = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <Outlet /> : <LoadingAnimation navTo={"/elRinconcitoDeSharpays"} />;
};

export default PrivateRoute;
