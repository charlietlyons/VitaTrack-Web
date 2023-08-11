import { Fab } from "@mui/material"
import ArrowForwardIosTwoToneIcon from '@mui/icons-material/ArrowForwardIosTwoTone';
import React from "react";

const SidebarFloatingButton = (props) => {
    const { sidebarHandler } = props;

    return (
        <Fab title="sidebar-button" onClick={sidebarHandler} sx={{
            position: 'fixed',
        }}>
            <ArrowForwardIosTwoToneIcon />
        </Fab>
    )
}

export default SidebarFloatingButton;             