import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

const StatsTable = ({ data }) => {
  
  // TODO: get current month, month -1, month -2 and the same month in last year
  return (
    <TableContainer component={Paper} sx={{ mt: 3 }}>
      <Table aria-label="simple table"
        sx={{
          minWidth: 100,
          "& .MuiTableCell-root": {
            p: 3
          }
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell></TableCell>
            <TableCell align="right">April</TableCell>
            <TableCell align="right">March</TableCell>
            <TableCell align="right">Feb</TableCell>
            <TableCell align="right">21-March</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map(({ name, current, m1, m2, lastYear }) => (
            <TableRow
              key={name}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">{current}</TableCell>
              <TableCell align="right">{m1}</TableCell>
              <TableCell align="right">{m2}</TableCell>
              <TableCell align="right">{lastYear}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default StatsTable;
