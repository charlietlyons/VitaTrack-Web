import React, { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BackendClient from "../../client/BackendClient";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const FoodLog = (props) => {
  const { intakes, error, setError, refreshIntakes } = props;

  const deleteIntake = useCallback(
    async (intakeId) => {
      const result = await BackendClient.deleteIntake(intakeId);
      if (!result) {
        setError("Could not delete intake. Try again later.");
      }
      refreshIntakes();
    },
    [setError, refreshIntakes]
  );

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
                <TableCell>
                  <CloseOutlinedIcon
                    data-testid={`intake-delete-${index}`}
                    onClick={() => deleteIntake(intake._id)}
                  />
                </TableCell>
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
