import React, { useContext } from "react";
import { Drawer, List } from "@mui/material";
import LogoutTwoToneIcon from '@mui/icons-material/LogoutTwoTone';
import HowToRegTwoToneIcon from '@mui/icons-material/HowToRegTwoTone';
import ArrowBackIosNewTwoToneIcon from '@mui/icons-material/ArrowBackIosNewTwoTone';
import PermIdentityTwoToneIcon from '@mui/icons-material/PermIdentityTwoTone';
import { AuthContext } from "../../context/AuthContext";
import SidebarListItem from "./SidebarListItem";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = (props) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    const authContext = useContext(AuthContext);
    const { isLoggedIn } = authContext;
    const { open, sidebarHandler } = props;

    const nonLoginItems = [
        {
            title: "Login",
            button: true,
            icon: <LogoutTwoToneIcon />,
            onClick: () => {navigate('/login')},
            active: location.pathname === '/login' ? 'active' : ''
        },
        {
            title: "Register",
            button: true,
            icon: <HowToRegTwoToneIcon />,
            onClick: () => {navigate('/register')},
            active: location.pathname === '/register' ? 'active' : ''
        },
    ]
    const loginItems = [
        {
            title: "Logout",
            button: true,
            icon: <LogoutTwoToneIcon />,
            onClick: () => {
                localStorage.removeItem("token");
                authContext.setIsLoggedIn(false);
                navigate('/login')
            },
        },
        {
            title: "Account",
            button: true,
            icon: <PermIdentityTwoToneIcon />,
            onClick: () => {
                navigate('/account')
            },
        }
    ]

    return (
        <Drawer
            variant="permanent"
            anchor="left"
            open={open}
        >
            <List>
                {(isLoggedIn ? loginItems : nonLoginItems).map((item, index) => {
                    return <SidebarListItem 
                        key={index}
                        title={item.title} 
                        button={item.button}
                        icon={item.icon} 
                        onClick={item.onClick}
                        active={item.active}
                    />
                })}
                <SidebarListItem 
                    button
                    icon={<ArrowBackIosNewTwoToneIcon />} 
                    onClick={sidebarHandler}
                />
            </List>
        </Drawer>
    )
}

export default Sidebar;