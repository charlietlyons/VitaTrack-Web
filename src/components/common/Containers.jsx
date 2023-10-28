import {
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
  Link,
  DialogContentText,
} from "@mui/material";
import styled from "styled-components";
import React from "react";

export const StyledPaper = styled(Paper)`
  && {
    display: flex;
    margin: auto;
    width: 50%;
    flex-direction: column;
  }
`;

export const PageContainer = (props) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        {props.children}
      </Grid>
    </Grid>
  );
};

export const FormContainer = (props) => {
  const { title, size, formFields, buttons, error, footerLink } = props;

  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={size || 8}>
        <Card>
          <CardHeader title={title} />
          <CardContent>
            {formFields &&
              formFields.map((field, index) => {
                return (
                  <Grid item key={index}>
                    {field}
                  </Grid>
                );
              })}

            {buttons.map((button, index) => {
              return (
                <Grid item key={index} xs={12}>
                  {button}
                </Grid>
              );
            })}

            {error && (
              <output id="form-error" data-testid="form-error">
                {error}
              </output>
            )}
            {footerLink && (
              <Link id={footerLink.id} onClick={footerLink.onClick}>
                {footerLink.text}
              </Link>
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export const DialogContainer = (props) => {
  const { title, subtitle, size, showDialog, children } = props;

  return (
    <Dialog
      open={showDialog}
      maxWidth={size || "sm"}
      fullWidth
      sx={{
        backgroundColor: "rgb(130, 255, 141, .5)",
      }}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText>{subtitle}</DialogContentText>
      {children}
    </Dialog>
  );
};
