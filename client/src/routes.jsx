import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import Login from "./view/Auth/Login";
import Signup from "./view/Auth/Signup";
import AuthLayout from "./Layouts/AuthLayout";
import DashboardLayout from "./Layouts/DashboardLayout";
import Order from "./view/Customer/Order";
import Products from "./view/Admin/Products";
import ProductsUser from "./view/Customer/Products";
import AddProducts from "./view/Admin/AddProducts";
import UpdateProduct from "./view/Admin/UpdateProduct";
import Dashboard from "./view/Admin/Dashboard";
import ProductDetails from "./view/Customer/ProductDetails";
import Cart from "./view/Customer/Cart";
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
              path: "order",
              element:<Order/>,
            },
            {
              path: "cart",
              element:<Cart/>,
            },
            {
              path: "product",
              element:<ProductsUser/>,
            },
            {
              path: "product-details/:productId",
              element:<ProductDetails/>,
            },
            
            
          ],
        },
        {
          path: "admin",
          children: [
            {
              path: "list",
              element:<Products/>,
            },
            {
              path: "add-product",
              element:<AddProducts/>,
            },
            {
              path: "edit-product/:id",
              element:<UpdateProduct/>,
            },
            {
              path: "system",
              element:<Dashboard/>,
            },
          ],
        },
        {
          path: "farmer",
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
  