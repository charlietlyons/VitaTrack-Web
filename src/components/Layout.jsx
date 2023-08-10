import React from 'react';
import Sidebar from './Sidebar/Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = (props) => {
    return <>
        {/* <Header /> */}
        <Sidebar />
        <Outlet />
        {/* <Footer /> */}
    </>
}

export default Layout;