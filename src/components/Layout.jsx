import React, { useCallback, useState } from 'react';
import Sidebar from './Sidebar/Sidebar';
import SidebarFloatingButton from './Sidebar/SidebarFloatingButton';
import { AuthProvider } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    const [ open, setOpen ] = useState(false);

    const sidebarHandler = useCallback(() => {
        if (open) {
            setOpen(false);
        } else {
            setOpen(true);
        }
    }, [open, setOpen]);

    return <AuthProvider>
        {/* <Header /> */}
        { open ? <Sidebar open={open} sidebarHandler={sidebarHandler}/> : <SidebarFloatingButton sidebarHandler={sidebarHandler}/>}
        <Outlet />
        {/* <Footer /> */}
    </AuthProvider>
}

export default Layout;