import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./view/Auth/Login";
import Signup from "./view/Auth/Signup";
import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
const router = createBrowserRouter([
    {
      path: "/",
      element: <App />,
    },
    {
      path: "auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "register",
          element: <Signup />,
        },
      ],
    },
    {
      path: "dashboard",
      element: <DashboardLayout />,
      children: [
      
        {
          path: "users",
          children: [
            {
              path: "",
              element: <Navigate to="list" replace />,
            },
            
            
          ],
        },
        {
          path: "bookings",
          children: [
            
          ],
        },
        {
          path: "financial",
          children: [
           
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/dashboard" replace />,
    },
  ]);
  export default router;
  