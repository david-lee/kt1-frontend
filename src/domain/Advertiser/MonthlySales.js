import React, { useEffect, useState } from 'react';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { Box, Grid, Typography } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { numberWithCommas } from 'shared/utils';
import { LoadingButton } from '@mui/lab';
import ReplayIcon from '@mui/icons-material/Replay';

const MonthlySales = ({ companyId }) => {
    const [sales, setSales] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const columnDefs = [
      { field: 'adType', headerName: 'AD Type', width: 80, resizable: false },
      { field: 'sum', headerName: 'Sales Amount', width: 120, resizable: false, valueFormatter: params => numberWithCommas(params.data.sum.toFixed(2)) }
    ];

    useEffect(() => {
      setIsLoading(true);
      fetchMonthlySales();
    }, [companyId])

    const fetchMonthlySales = () => {
      axios.get(`${api.monthlySales}/${companyId}`)
        .then(({ data }) => {
          const total = data.reduce((pre, cur) => { return pre + cur.sum }, 0);
            setSales([{ adType: 'TOTAL', sum: total }, ...data]);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (isLoading) return <div>loading...</div>

    if (!sales || sales[0].sum === 0) return <Typography sx={{fontSize: 16, fontWeight:600, color: '#e90000'}}>There is no sales for this month</Typography>

    return (
      <Grid container direction="column" rowGap={3}>
        <Grid item>
          <LoadingButton loading={isLoading}
            variant="contained"
              onClick={() => {
                fetchMonthlySales();
              }}
              startIcon={<ReplayIcon />}
          >
            Reload
          </LoadingButton>
        </Grid>
        <Grid item>
          <Box>
            <Box sx={{ width: 240, height: 200 }} className="ag-theme-alpine">
              <AgGridReact
                rowData={sales}
                columnDefs={columnDefs}
                defaultColDef={{
                  sortable: true,
                  resizable: true,
                  cellStyle: () => ({
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  })
                }}
              >
              </AgGridReact>
            </Box>
          </Box>
        </Grid>
      </Grid>
    )
}

export default MonthlySales;