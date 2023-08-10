import React from "react";
import { Drawer, List, makeStyles } from "@mui/material";
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import SidebarListItem from "./SidebarListItem";
import { useLocation, useNavigate } from "react-router-dom";


const Sidebar = () => {
    const location = useLocation();
    const navigate = useNavigate();    

    return (
        <Drawer
            variant="permanent"
            anchor="left"
        >
            <List>
                <SidebarListItem 
                    title="Login" 
                    button 
                    icon={<LogoutTwoToneIcon />} 
                    onClick={() => {navigate('/login')}}
                    active={location.pathname === '/login' ? 'active' : ''}
                />
                <SidebarListItem 
                    title="Register"
                    button
                    icon={<HowToRegTwoToneIcon />} 
                    onClick={() => {navigate('/register')}}
                    active={location.pathname === '/register' ? 'active' : ''}
                />
            </List>
        </Drawer>
    )
}

export default Sidebar;