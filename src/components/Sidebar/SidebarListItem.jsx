import React from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const SidebarListItem = (props) => {
  const { title, icon, button, onClick, active, sx, testId } = props;

  const activeStyling = {
    backgroundColor: "#f5f5f5",
    ...sx,
    "&:hover": {
      backgroundColor: "#f5f5f5",
    },
  };
  const StyledListItem = styled(ListItem)`
    && {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
  const StyledListItemButton = styled(ListItemButton)`
    && {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `;
  const StyledListItemIcon = styled(ListItemIcon)`
    && {
      display: flex;
      justify-content: flex-end;
    }
  `;

  const IconComponent = icon ? (
    <StyledListItemIcon title="sidebar-item-icon">{icon}</StyledListItemIcon>
  ) : null;

  return (
    <StyledListItem
      title={title}
      key={title}
      onClick={onClick}
      sx={active ? activeStyling : {}}
      data-testid={testId}
    >
      {button ? (
        <StyledListItemButton title="sidebar-item-button">
          {title}
          {IconComponent}
        </StyledListItemButton>
      ) : (
        <>
          <ListItemText primary={title} />
          {IconComponent}
        </>
      )}
    </StyledListItem>
  );
};

export default SidebarListItem;
