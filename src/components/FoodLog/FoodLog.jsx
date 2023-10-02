import React, { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BackendClient from "../../client/BackendClient";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import IntakeDialog from "../IntakeDialog/IntakeDialog";

const FoodLog = (props) => {
  const { intakes, error, setError, refreshIntakes } = props;

  const [selectedIntakeId, setSelectedIntakeId] = useState(null);
  const [showEditDialog, setShowEditDialog] = useState(false);

  const editIntake = useCallback(
    async (intakeId) => {
      setSelectedIntakeId(intakeId);
      setShowEditDialog(true);
    },
    [setShowEditDialog, setSelectedIntakeId]
  );

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
    <>
      {showEditDialog && (
        <IntakeDialog
          intakeId={selectedIntakeId}
          showDialog={showEditDialog}
          setShowDialog={setShowEditDialog}
          refreshIntakes={refreshIntakes}
        />
      )}

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
                  <TableCell>
                    <EditOutlinedIcon
                      data-testid={`intake-edit-${index}`}
                      onClick={() => editIntake(intake._id)}
                    />
                    <CloseOutlinedIcon
                      data-testid={`intake-delete-${index}`}
                      onClick={() => deleteIntake(intake._id)}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </>
  ) : (
    <output data-testid="error">{error}</output>
  );
};

export default React.memo(FoodLog);
