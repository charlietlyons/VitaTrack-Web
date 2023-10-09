import React from "react";
import { TableCell, TableRow } from "@mui/material";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

const Intake = (props) => {
  const {
    index,
    _id,
    name,
    quantity,
    calories,
    protein,
    carbs,
    fat,
    editIntake,
    deleteIntake,
  } = props;

  return (
    <TableRow key={index} data-testid={`intake-${index}`}>
      <TableCell>{name}</TableCell>
      <TableCell>{quantity}</TableCell>
      <TableCell>{calories}</TableCell>
      <TableCell>{protein}</TableCell>
      <TableCell>{carbs}</TableCell>
      <TableCell>{fat}</TableCell>
      <TableCell>
        <EditOutlinedIcon
          data-testid={`intake-edit-${index}`}
          onClick={() => editIntake(_id)}
        />
        <CloseOutlinedIcon
          data-testid={`intake-delete-${index}`}
          onClick={() => deleteIntake(_id)}
        />
      </TableCell>
    </TableRow>
  );
};

export default Intake;
