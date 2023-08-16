import React, { useContext } from "react";
import { Drawer, List } from "@mui/material";
import LogoutTwoToneIcon from "@mui/icons-material/LogoutTwoTone";
import HowToRegTwoToneIcon from "@mui/icons-material/HowToRegTwoTone";
import ArrowBackIosNewTwoToneIcon from "@mui/icons-material/ArrowBackIosNewTwoTone";
import PermIdentityTwoToneIcon from "@mui/icons-material/PermIdentityTwoTone";
import TodayTwoToneIcon from "@mui/icons-material/TodayTwoTone";
import { AuthContext } from "../../context/AuthContext";
import SidebarListItem from "./SidebarListItem";
import { useLocation, useNavigate } from "react-router-dom";

const Sidebar = (props) => {
  const location = useLocation();
  const navigate = useNavigate();

  const authContext = useContext(AuthContext);
  const { isLoggedIn } = authContext;
  const { open, sidebarHandler } = props;

  const loggedOutItems = [
    {
      title: "Login",
      button: true,
      icon: <LogoutTwoToneIcon />,
      onClick: () => {
        navigate("/vitatrack/login");
      },
      active: location.pathname === "/vitatrack/login" ? "active" : "",
    },
    {
      title: "Register",
      button: true,
      icon: <HowToRegTwoToneIcon />,
      onClick: () => {
        navigate("/vitatrack/register");
      },
      active: location.pathname === "/vitatrack/register" ? "active" : "",
    },
  ];
  const loggedInItems = [
    {
      title: "Daily",
      button: true,
      icon: <TodayTwoToneIcon />,
      onClick: () => {
        navigate("/vitatrack/daily");
      },
    },
    {
      title: "Account",
      button: true,
      icon: <PermIdentityTwoToneIcon />,
      onClick: () => {
        navigate("/vitatrack/account");
      },
    },
    {
      title: "Logout",
      button: true,
      icon: <LogoutTwoToneIcon />,
      onClick: () => {
        localStorage.removeItem("token");
        authContext.setIsLoggedIn(false);
        navigate("/vitatrack/login");
      },
    },
  ];

  return (
    <Drawer variant="permanent" anchor="left" open={open}>
      <List>
        {(isLoggedIn ? loggedInItems : loggedOutItems).map((item, index) => {
          return (
            <SidebarListItem
              key={index}
              title={item.title}
              button={item.button}
              icon={item.icon}
              onClick={item.onClick}
              active={item.active}
            />
          );
        })}
        <SidebarListItem
          button
          icon={<ArrowBackIosNewTwoToneIcon />}
          onClick={sidebarHandler}
        />
      </List>
    </Drawer>
  );
};

export default Sidebar;
