import React, { useCallback, useEffect, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import SidebarFloatingButton from './Sidebar/SidebarFloatingButton';
import { AuthProvider } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';
import BackendClient from '../client/BackendClient';

const Layout = () => {
    const [ open, setOpen ] = useState(false);
    const [ isLoggedIn, setIsLoggedIn ] = useState(false);
    const [ user, setUser ] = useState(null);

    useEffect(() => {
        BackendClient.verifyToken(localStorage.getItem("token"), setIsLoggedIn);
    }, [setIsLoggedIn]);

    const sidebarHandler = useCallback(() => {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [open, setOpen]);

    return <AuthProvider value={{
        user,
        isLoggedIn,
        setUser,
        setIsLoggedIn
    }}>
        {/* <Header /> */}
        { open ? <Sidebar open={open} sidebarHandler={sidebarHandler}/> : <SidebarFloatingButton sidebarHandler={sidebarHandler}/>}
        <Outlet />
        {/* <Footer /> */}
    </AuthProvider>
}

export default Layout;