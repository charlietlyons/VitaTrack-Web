import React from "react";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";
import AccountDetails from "./components/AccountDetails";
import DailyStats from "./components/DailyStats";

const router = createBrowserRouter([
  {
    path: "*",
    element: <Navigate to="/vitatrack/daily" replace={true} />,
  },
  {
    path: "/vitatrack",
    element: <Layout />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "logout",
        element: <Login />,
      },
      {
        path: "account",
        element: <AccountDetails />,
      },
      {
        path: "daily",
        element: <DailyStats />,
      },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
