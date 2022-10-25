import React, { useState } from 'react';
import { Grid, TextField, Typography } from "@mui/material";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { LoadingButton } from '@mui/lab';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { formatUIDate, numberWithCommas } from 'shared/utils';
import usePayments from 'shared/hooks/usePayments';
import ConfirmDialog from 'shared/components/ConfirmDialog';
import { deptType } from 'data/constants';
import { useNavigate } from 'react-router-dom';

const CollectionBills = () => {
  const { user } = useUserAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [billNumber, setBillNumber] = useState("");
  const [selectedPayId, setSelectedPayId] = useState(null);
  const { user: { dept } } = useUserAuth();
  const navigate = useNavigate();

  const onFetch = () => {
    setIsOpen(false);
  }

  const confirmDelete = (payId) => {
    setSelectedPayId(payId);
    setIsOpen(true);
  }

  const { isLoading, billPayments, deletePayment, fetchPayments } = usePayments(onFetch);
  
  if (dept.toLowerCase() === deptType.sales || dept.toLowerCase() === deptType.sub) {
    navigate('/s/dashboard', { replace: true });
    return null;
  }

  return (
    <>
      <ConfirmDialog open={isOpen} title="Delete Payment" message="Do you want to delete the payment?" 
        isLoading={isLoading} deleteOp
        onOK={() => deletePayment([selectedPayId], user.userId, billNumber)} 
        onCancel={() => setIsOpen(false)} onClose={() => setIsOpen(false)} 
      />

      <Grid container alignItems="center" justifyContent="center" sx={{ my: 10 }} columnGap={4}>
        <Grid item xs={1}>
          <TextField label="Bill No" name="billNo" value={billNumber}
            variant="standard" onChange={(e) => setBillNumber(e.target.value)}
            sx={{ width: "100%" }}
          />
        </Grid>
        <Grid item xs={1} sx={{ position: "relative", top: "5px" }}>
          <LoadingButton variant="contained" loading={isLoading} onClick={() => fetchPayments(billNumber)}>
            Search
          </LoadingButton>
        </Grid>
      </Grid>
      
      {!isLoading && !billPayments && <Grid container item><Typography>No payments</Typography></Grid>}

      {billPayments && (
        <>
          <Grid container lignItems="center" justifyContent="center" columnGap={3} sx={{ mb: 10 }}>
            <Grid item xs={3}>
              <TextField label="AD Title" value={billPayments.adTitle} variant="standard" InputProps={{ readOnly: true }} fullWidth />
            </Grid>
            <Grid item>
              <TextField label="AD Type" value={billPayments.adType} variant="standard" InputProps={{ readOnly: true }} />
            </Grid>        
            <Grid item>
              <TextField label="Cost" value={numberWithCommas(billPayments.cost)} variant="standard" InputProps={{ readOnly: true }} />
            </Grid>        
            <Grid item>
              <TextField label="Tax" value={numberWithCommas(billPayments.taxAmount)} variant="standard" InputProps={{ readOnly: true }} />
            </Grid>        
          </Grid>

          <Grid container alignItems="center" justifyContent="center" rowGap={3}>
            {billPayments.paidList?.map(({ payId, paidDate, paidAmount, paidTax, total, regBy, regDate, method }) => {
              return (
                <Grid container item columnGap={3} wrap="nowrap" justifyContent="center">
                  <Grid item>
                    <TextField label="Pay No" value={payId} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Paid Date" value={formatUIDate(paidDate)} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Paid Amount" value={numberWithCommas(paidAmount)} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Paid Tax" value={numberWithCommas(paidTax)} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Paid Total" value={numberWithCommas(total)} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Method" value={method} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Reg Date" value={formatUIDate(regDate)} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <TextField label="Reg By" value={regBy} variant="standard" InputProps={{ readOnly: true }} />
                  </Grid>
                  <Grid item>
                    <DeleteForeverIcon sx={{ position: "relative", top: "20px", color: "red", cursor: "pointer" }}
                      onClick={() => confirmDelete(payId)}/>
                  </Grid>
                </Grid>
              )})
            }
          </Grid>
        </> 
      )}
    </>
  );
};

export default CollectionBills;
