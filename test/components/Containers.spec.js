import { PageContainer } from "../../src/components/common/Containers";
import { render, screen } from "@testing-library/react";
import React from "react";
import "@testing-library/jest-dom";

describe("Containers", () => {
  it("should render child elements", () => {
    const childElement = <div title="big-boy">child</div>;
    render(<PageContainer>{childElement}</PageContainer>);

    expect(screen.getByTitle("big-boy")).toBeInTheDocument();
  });
});
