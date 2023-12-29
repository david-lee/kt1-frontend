import React, { useCallback, useState, useEffect } from 'react';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, IconButton, Collapse } from '@mui/material';
import { formatUIDate, numberWithCommas } from 'shared/utils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ReceiptDetail = ({row, handleSelected}) => {
  //const { row } = row;
  const [detailOpen, setDetailOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);

  const onDetailOpen = async () => {
    await setDetailOpen(!detailOpen)
  }

  const onSelectedChange = async () => {
    await setIsSelected(!isSelected);
  }
  
  return (
    <>
      <TableRow sx={{ '&>*': { borderBottom: 'unset' } }} style={{backgroundColor: detailOpen ? "lightblue" : ""}}>
        <TableCell padding="checkbox">
          <Checkbox
           color="primary"       
           checked={isSelected}
           onClick={(event) => handleSelected(event, row)}
           onChange={onSelectedChange}
          />
        </TableCell>
        <TableCell>{row.adId}</TableCell>
        <TableCell>{row.adType}</TableCell>
        <TableCell>{row.adTitle}</TableCell>
        <TableCell>{formatUIDate(row.startDate)}</TableCell>
        <TableCell>{formatUIDate(row.endDate)}</TableCell>
        <TableCell>{numberWithCommas(row.cost)}</TableCell>
        <TableCell>{numberWithCommas(row.taxAmount)}</TableCell>
        <TableCell>{numberWithCommas(row.cost + row.taxAmount)}</TableCell>
        <TableCell>{row.adPage}</TableCell>
        <TableCell>{row.adSize}</TableCell>
        <TableCell>{row.adTitle}</TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={onDetailOpen}
          >
            {detailOpen ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{paddingBottom:0, paddingTop:0}} colSpan={8}>
          <Collapse in={detailOpen} timeout="auto" unmountOnExit>
            <Box sx={{margin:1}}>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableCell />
                  <TableCell>Pay Id</TableCell>
                  <TableCell>Paid Cost</TableCell>
                  <TableCell>Paid Tax</TableCell>
                  <TableCell>Paid Total</TableCell>
                  <TableCell>Paid Date</TableCell>
                  <TableCell>Paid Method</TableCell>
                </TableHead>
                <TableBody>
                  {row.getReceiptListDetail.map((detailRow) => (
                    <TableRow key={detailRow.payId.toString()}>
                      <TableCell />
                      <TableCell>{detailRow.payId}</TableCell>
                      <TableCell>{numberWithCommas(detailRow.paidAmount)}</TableCell>
                      <TableCell>{numberWithCommas(detailRow.paidTax)}</TableCell>
                      <TableCell>{numberWithCommas(detailRow.paidAmount + detailRow.paidTax)}</TableCell>
                      <TableCell>{formatUIDate(detailRow.paidDate)}</TableCell>
                      <TableCell>{detailRow.paidMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}

export default ReceiptDetail;