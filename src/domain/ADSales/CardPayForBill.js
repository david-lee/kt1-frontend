import React, { useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button, Link, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Typography } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CardTransaction from './CardTransation';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const CardPayForBill = ({ cardPayList }) => {
    const [isCardTransactionOpen, setIsCardTransactionOpen] = useState(false);
    const list = [...cardPayList];
    const [payData, setPayData] = useState(null);

    const payCard = (row) => {
        setPayData(row);
        setIsCardTransactionOpen(true);
    }


    return (
        <>
            {isCardTransactionOpen && <CardTransaction
                onClose={() => setIsCardTransactionOpen(false)}
                onOpen={isCardTransactionOpen}
                payData = {payData}
            />
            }

            <TableContainer component={Paper} sx={{ mt: 6 }}>
                <Table sx={{ maxWidth: 1200 }} aria-label="card pay list">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Bill No.</StyledTableCell>
                            <StyledTableCell>Ad Type</StyledTableCell>
                            <StyledTableCell>Company Id</StyledTableCell>
                            <StyledTableCell>Company Name</StyledTableCell>
                            <StyledTableCell>Invoice No.</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Card No.</StyledTableCell>
                            <StyledTableCell>Pay</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            list.map((row) => (
                                <StyledTableRow key={row.adId}>
                                    <StyledTableCell>{row.adId}</StyledTableCell>
                                    <StyledTableCell>{row.adType}</StyledTableCell>
                                    <StyledTableCell>{row.companyId}</StyledTableCell>
                                    <StyledTableCell>{row.companyName}</StyledTableCell>
                                    <StyledTableCell>{row.invoiceNo}</StyledTableCell>
                                    <StyledTableCell>{row.cost + row.taxAmount}</StyledTableCell>
                                    {/* <StyledTableCell>{(row.creditCard.lastDigit !== "") ? row.creditCard.lastDigit : <Button variant = 'outlined'>Btn</Button>}</StyledTableCell> */}
                                    <StyledTableCell>
                                        {(row.creditCard.lastDigit !== "")
                                            ? row.creditCard.lastDigit
                                            : <Link href={`/s/advertiser/${row.companyId}`} variant='outline'>카드등록</Link>}
                                    </StyledTableCell>
                                    <StyledTableCell>
                                        <Button variant="outlined" onClick={() => payCard(row)} disabled={!row.creditCard.lastDigit}>
                                            Pay
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}

export default CardPayForBill;