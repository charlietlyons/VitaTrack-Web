import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BackendClient from "../../client/BackendClient";

const FoodLog = () => {
  const [intakes, setIntakes] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    BackendClient.getIntakes(
      (data) => {
        setIntakes(data);
      },
      (error) => {
        setError(error);
      }
    );
  }, [setIntakes, setError]);

  return !error ? (
    <Table>
      <TableHead>
        <TableRow>
          <TableCell>Food</TableCell>
          <TableCell>Quantity</TableCell>
          <TableCell>Calories</TableCell>
          <TableCell>Protein</TableCell>
          <TableCell>Carbs</TableCell>
          <TableCell>Fat</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {intakes.length > 0 &&
          intakes.map((intake, index) => {
            return (
              <TableRow key={index} data-testid={`intake-${index}`}>
                <TableCell>{intake.name}</TableCell>
                <TableCell>{intake.quantity}</TableCell>
                <TableCell>{intake.calories}</TableCell>
                <TableCell>{intake.protein}</TableCell>
                <TableCell>{intake.carbs}</TableCell>
                <TableCell>{intake.fat}</TableCell>
              </TableRow>
            );
          })}
      </TableBody>
    </Table>
  ) : (
    <output data-testid="error">{error}</output>
  );
};

export default React.memo(FoodLog);
