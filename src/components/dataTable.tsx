import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { technicalSpecification } from "../helpers/mocks";
import TextField from "@mui/material/TextField";

const columns = [
  { id: "item", label: "Item" },
  { id: "description", label: "Description" },
  { id: "minimalLengh", label: "Minimal Length" },
  { id: "stock", label: "Stock" },
  { id: "sended", label: "Sended" },
];

export default function WEGTable() {
  const [sendedData, setSendedData] = React.useState(
    technicalSpecification.map((row) => ({ item: row.item, sended: row.stock }))
  );

  const handleSendedDataChange = (event: any, itemId: any) => {
    const newSendedData = sendedData.map((data) =>
      data.item === itemId ? { ...data, sended: event.target.value } : data
    );
    setSendedData(newSendedData);
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                align="center"
                key={column.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {technicalSpecification.map((row: any) => {
            const sendedDataRow = sendedData.find(
              (data) => data.item === row.item
            );
            return (
              <TableRow
                key={row.item}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                {columns.map((column: any) => {
                  if (column.id === "sended") {
                    return (
                      <TableCell key={column.id} align="center">
                        <TextField
                          type="number"
                          value={sendedDataRow.sended}
                          onChange={(event) =>
                            handleSendedDataChange(event, row.item)
                          }
                        />
                      </TableCell>
                    );
                  } else {
                    return (
                      <TableCell key={column.id} align="center">
                        {row[column.id]}
                      </TableCell>
                    );
                  }
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
