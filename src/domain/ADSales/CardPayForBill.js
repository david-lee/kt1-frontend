import React, { useState, useCallback, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { Button, TextField, Typography, Grid } from '@mui/material';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CardTransaction from './CardTransation';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import path from 'data/routes';

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

const CardPayForBill = () => {
    const [isCardTransactionOpen, setIsCardTransactionOpen] = useState(false);
    const [payData, setPayData] = useState(null);
    const [cardPayList, setCardPayList] = useState([]);
    const [isListLoading, setIsListLoading] = useState(false);

    const [searchBillNo, setSearchBillNo] = useState("");
    const [searchAdType, setSearchAdType] = useState("");
    const [searchCompanyId, setSearchCompanyId] = useState("");
    const [searchCompanyName, setSearchCompanyName] = useState("");

    const navigate = useNavigate();
    const moveToCardRegister = (companyId) => {
        navigate(`/s/${path.advertiser}/${companyId}/5`);
    }

    const payCard = (row) => {
        setPayData(row);
        setIsCardTransactionOpen(true);
    }

    const fetchCardPayBills = useCallback(() => {
        setIsListLoading(true);

        axios.get(`${api.cardPayBillList}`)
            .then((res) => {
                setCardPayList([...res.data]);
            })
            .finally(() => {
                setIsListLoading(false);
            });
    }, [])

    useEffect(() => {
        fetchCardPayBills();
    }, [])

    return (
        <>
            {isCardTransactionOpen && <CardTransaction
                onClose={() => setIsCardTransactionOpen(false)}
                onOpen={isCardTransactionOpen}
                payData={payData}
                fetchCardPayBills={fetchCardPayBills}
            />
            }

            <Typography variant="h5" sx={{ mt: 16 }}>Credit Card Payment</Typography>
            
            <TableContainer component={Paper} sx={{ mt: 6 }}>
                <Table sx={{ maxWidth: 1300 }} aria-label="card pay list">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>Bill No.</StyledTableCell>
                            <StyledTableCell>Ad Type</StyledTableCell>
                            <StyledTableCell>Company Id</StyledTableCell>
                            <StyledTableCell>Company Name</StyledTableCell>
                            <StyledTableCell>Invoice No.</StyledTableCell>
                            <StyledTableCell>Amount</StyledTableCell>
                            <StyledTableCell>Last 4 digit</StyledTableCell>
                            <StyledTableCell>Pay</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/* filtering */}
                        <TableRow>
                            <TableCell>
                                <TextField id="outlined-size-small" size="small" label="Bill No." variant="outlined"
                                    onChange={e => setSearchBillNo(e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-size-small" size="small" label="Ad Type" variant="outlined"
                                    onChange={e => setSearchAdType(e.target.value.toUpperCase())} />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-size-small" size="small" label="Company Id" variant="outlined"
                                    onChange={e => setSearchCompanyId(e.target.value)} />
                            </TableCell>
                            <TableCell>
                                <TextField id="outlined-size-small" size="small" label="Company Name" variant="outlined"
                                    onChange={e => setSearchCompanyName(e.target.value)} />
                            </TableCell>
                            <TableCell /><TableCell /><TableCell /><TableCell />
                        </TableRow>
                        {
                            cardPayList
                                .filter(x => x.adId.toString().includes(searchBillNo))
                                .filter(x => x.adType.includes(searchAdType))
                                .filter(x => x.companyName.includes(searchCompanyName))
                                .filter(x => x.companyId.toString().includes(searchCompanyId))
                                .map((row) => (
                                    <StyledTableRow key={row.adId}>
                                        <StyledTableCell>{row.adId}</StyledTableCell>
                                        <StyledTableCell>{row.adType}</StyledTableCell>
                                        <StyledTableCell>{row.companyId}</StyledTableCell>
                                        <StyledTableCell>{row.companyName}</StyledTableCell>
                                        <StyledTableCell>{row.invoiceNo}</StyledTableCell>
                                        <StyledTableCell>{row.cost + row.taxAmount}</StyledTableCell>
                                        <StyledTableCell>
                                            {(row.creditCard.lastDigit !== "")
                                                ? row.creditCard.lastDigit
                                                : <Button variant="contained" color="info" onClick={() => moveToCardRegister(row.companyId)}>등록</Button>
                                            }
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            <Button variant="outlined" onClick={() => payCard(row)} disabled={!row.creditCard.lastDigit || row.cost + row.taxAmount == 0}>
                                                {(row.cost + row.taxAmount > 0) ? "Pay" : "Paid"}
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