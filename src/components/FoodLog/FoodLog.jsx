import React, { useCallback, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import BackendClient from "../../client/BackendClient";
import IntakeDialog from "../IntakeDialog/IntakeDialog";
import Intake from "../Intake";

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
                <Intake
                  index={index}
                  deleteIntake={deleteIntake}
                  editIntake={editIntake}
                  {...intake}
                />
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
