import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Login />,
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