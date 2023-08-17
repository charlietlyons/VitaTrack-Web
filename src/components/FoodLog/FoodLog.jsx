import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@mui/material";
import BackendClient from "../../client/BackendClient";

const FoodLog = () => {
    const [intakes, setIntakes] = useState([]);

    useEffect(() => {
        BackendClient.getIntakes(
            (response) => {
                setIntakes(response.data);
            },
            (error) => {
                console.log("Something went wrong.");
            }
        );
    }, [setIntakes])

    return (
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
                {intakes && intakes.map((intake, index) => {
                    return <TableRow key={index}>
                        <TableCell>{intake.name}</TableCell>
                        <TableCell>{intake.quantity}</TableCell>
                        <TableCell>{intake.calories}</TableCell>
                        <TableCell>{intake.protein}</TableCell>
                        <TableCell>{intake.carbs}</TableCell>
                        <TableCell>{intake.fat}</TableCell>
                    </TableRow>
                })}
            </TableBody>
        </Table>
    );
}

export default React.memo(FoodLog);