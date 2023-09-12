import {
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Dialog,
  DialogTitle,
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
  const { title, size, formFields, buttons, error } = props;

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

            {buttons.map((button) => {
              return (
                <Grid item xs={12}>
                  {button}
                </Grid>
              );
            })}

            {error ? <output>{error}</output> : <></>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export const DialogContainer = (props) => {
  const { title, showDialog, children } = props;

  return (
    <Dialog open={showDialog}>
      <DialogTitle>{title}</DialogTitle>
      {children}
    </Dialog>
  );
};
