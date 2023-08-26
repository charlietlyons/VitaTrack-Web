import { render, screen } from "@testing-library/react";
import SidebarListItem from "../../src/components/Sidebar/SidebarListItem";
import { ArrowBackIosNewSharp } from "@mui/icons-material";
import React from "react";
import "@testing-library/jest-dom";

describe("SidebarListItem", () => {
  it("Should render icon and button components if provided", () => {
    render(
      <SidebarListItem icon={<ArrowBackIosNewSharp />} button>
        Test
      </SidebarListItem>
    );

    const iconElement = screen.queryByTitle("sidebar-item-icon");
    const buttonElement = screen.queryByTitle("sidebar-item-button");

    expect(iconElement).toBeInTheDocument();
    expect(buttonElement).toBeInTheDocument();
  });

  it("Should not render icon and button components if not provided", () => {
    render(<SidebarListItem></SidebarListItem>);
  });
});
