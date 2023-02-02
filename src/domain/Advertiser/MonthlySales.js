import React, { useEffect, useState } from 'react';
import api from 'appConfig/restAPIs';
import axios from 'axios';
import { Box } from '@mui/material';
import { AgGridReact } from 'ag-grid-react';
import { numberWithCommas } from 'shared/utils';

const MonthlySales = ({ companyId, tabIndex }) => {
    const [sales, setSales] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const columnDefs = [
        { field: 'adType', headerName: 'AD Type', width: 80, resizable: false },
        { field: 'sum', headerName: 'Sales Amount', width: 120, resizable: false, valueFormatter: params => numberWithCommas(params.data.sum.toFixed(2)) }
    ];

    useEffect(() => {
        setIsLoading(true);
        axios.get(`${api.monthlySales}/${companyId}`)
            .then(({ data }) => {
                const total = data.reduce((pre, cur) => { return pre + cur.sum}, 0);
                setSales([{adType: 'TOTAL', sum: total}, ...data]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [companyId, tabIndex===4])

    if (isLoading) return <div>loading...</div>

    if (!sales) return  null;

    return (
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
    )
}

export default MonthlySales;