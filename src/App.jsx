import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    }, 
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
]);

const App = (props) => {
    return <RouterProvider router={router} >
        {props.children}
    </RouterProvider>;
}

export default App;