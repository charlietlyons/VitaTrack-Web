import { Paper, Grid, Card, CardContent, CardHeader } from "@mui/material";
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

export const FormContainer = (props) => {
  return (
    <Grid container justifyContent="center" alignItems="center">
      <Grid item xs={8}>
        <Card>
          <CardHeader title={props.title} />
          <CardContent>
            {props.formFields.map((field) => {
              return <Grid item>{field}</Grid>;
            })}
            <Grid item xs={12}>
              {props.submitButton}
            </Grid>
            {props.error ? <output>{props.error}</output> : <></>}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};
