import axios from 'axios';
import React, { useEffect, useState } from 'react';
import api from 'appConfig/restAPIs';
import { Box, Paper, Typography } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { numberWithCommas } from 'shared/utils';

const StatsPayment = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    axios.get(`${api.statsPayment}`)
      .then(({ data }) => {
        setStats(data);
      })
      .finally();
  }, []);

  return (
    <Box sx={{ pr: 5 }}>
      <Typography variant="h5" sx={{ mb: 5 }}>Payment Stats</Typography>
      
      {!stats && <Typography variant="body1" sx={{ mt: 5 }}>No Stats</Typography>}

      {stats && (
        <>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'><Typography variant="body1">Number of payments</Typography></TableCell>
                  <TableCell align='center'><Typography variant="body1">Total Amount</Typography></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {stats.collectionTotal.totalNumberOf}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {numberWithCommas(stats.collectionTotal.totalAmount)}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>  

          <TableContainer component={Paper} sx={{ mt: 5 }}>
            <Table sx={{ minWidth: 650 }}>
              <TableHead>
                <TableRow>
                  <TableCell align='center'><Typography variant="body1">Person in charge</Typography></TableCell>
                  <TableCell align='center'><Typography variant="body1">Number of ADs</Typography></TableCell>
                  <TableCell align='center'><Typography variant="body1">Amount</Typography></TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {
                  stats.collection.map((stat, index) => (
                    <TableRow key={index}>
                      <TableCell><Typography variant="h6">{stat.salesPerson}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="h6">{stat.numberOf}</Typography></TableCell>
                      <TableCell align="center"><Typography variant="h6">{numberWithCommas(stat.amount)}</Typography></TableCell>
                    </TableRow>
                  ))
                }
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
};

export default StatsPayment;
