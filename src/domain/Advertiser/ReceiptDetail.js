import React, { useCallback, useState, useEffect } from 'react';
import { Box, Grid, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Checkbox, Paper, IconButton, Collapse } from '@mui/material';
import { formatUIDate, numberWithCommas } from 'shared/utils';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

const ReceiptDetail = ({row}) => {
  //const { row } = row;
  const [detailOpen, setDetailOpen] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);


  const handleSelected = (event) => {
    setIsSelected(!isSelected);
        
    console.log("isSelected",isSelected);
    console.log("event.target.checked", event.target.checked);
    // 체크했을때 같은게 없다면 추가 있다면 그대로
    // 언체크했을때 같은게 있다면 빼고 없다면 그대로
    
    if(event.target.checked){
      setSelectedItems([...selectedItems, row]);
    }else{
      let selectUpdated = selectedItems.filter(val => val.adId !== row.adId);
      setSelectedItems([...selectUpdated]);
    }

    console.log("selectedItems", selectedItems);
  }

  const onSelectedChange = () => {
    setIsSelected(!isSelected);
  }
  

  return (
    <>
      <TableRow sx={{ '&>*': { borderBottom: 'unset' } }} style={{backgroundColor: detailOpen ? "lightblue" : ""}}>
        <TableCell padding="checkbox">
          <Checkbox
           color="primary"
           
           // 체크하면 isSelected 상태변하고, 해당 객체 포함
           // 언체크하면 isSelected 상태 변하고, 해당 객체 제외
           
           checked={isSelected}
           onClick={(event) => handleSelected(event)}
           //onChange={onSelectedChange}
          // indeterminate={numSelected > 0 && numSelected === rowCount}
          // checked={rowCount > 0 && numSelected === rowCount}
          // onChange={onSelectAllClick}
          // inputProps={{'aria-label': 'select all desserts'}}
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
            onClick={() => setDetailOpen(!detailOpen)}
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