import { Navigate, Outlet } from "react-router-dom";
import { useState, useEffect } from "react";

function AuthLayout() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // Optional: you can use useEffect to monitor changes in localStorage if necessary.
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, []);

  // If token exists, redirect to the dashboard
  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  // Otherwise, render the child routes
  return (
    <main>
      <Outlet />
    </main>
  );
}

export default AuthLayout;
