import { Box, Grid } from '@mui/material';
import React from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import StatsCard from './StatsCard';
import StatsTable from './StatsTable';

const data = [
  {
    name: "Jan",
    amt: 2400
  },
  {
    name: "Feb",
    amt: 2210
  },
  {
    name: "Mar",
    amt: 2290
  },
  {
    name: "Apr",
    amt: 2000
  },
  {
    name: "May",
    amt: 2181
  },
  {
    name: "Jun",
    amt: 2500
  },
  {
    name: "July",
    amt: 2100
  },
  {
    name: "Aug",
    amt: 2081
  },
  {
    name: "Sep",
    amt: 2700
  },
  {
    name: "Oct",
    amt: 2900
  },
  {
    name: "Nov",
    amt: 2511
  },
  {
    name: "Dec",
    amt: 3100
  }
];

const tableData = [
  { name: 'Sales', current: 159, m1: 6.0, m2:24, lastYear: 4.0 },
  { name: 'Collection', current: 237, m1: 9.0, m2: 37, lastYear: 4.3 },
  { name: 'Outstanding', current: 262, m1: 16.0, m2: 24, lastYear: 6.0 },
  { name: 'Overdue', current: 305, m1: 3.7, m2: 67, lastYear: 4.3 },
];

const ADStats = () => {
  return (
    <Box sx={{ mt: 8 }}>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={2}>
          <StatsCard label="Revenue in 2022" stat={123456} isMoney />
        </Grid>
        <Grid item xs={2}>
          <StatsCard label="DAD" stat={100000} isMoney/>
        </Grid>
        <Grid item xs={2}>
          <StatsCard label="WKY" stat={80000} isMoney/>
        </Grid>
        <Grid item xs={2}>
          <StatsCard label="CAD" stat={60000} isMoney/>
        </Grid>
        <Grid item xs={2}>
          <StatsCard label="WAD" stat={70000} isMoney/>        
        </Grid>
        <Grid item xs={2}>
          <StatsCard label="BD" stat={50000} isMoney/>
        </Grid>                
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={8}>
          <ResponsiveContainer height={270}>
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 0
              }}
            >
              <defs>
                <linearGradient id="colorAD" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
                </linearGradient>
              </defs>            
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="amt" stroke="#8884d8" fillOpacity={1} fill="url(#colorAD)" />
            </AreaChart>
          </ResponsiveContainer>
        </Grid>

        <Grid item xs={4}>
          <StatsTable data={tableData} />
        </Grid>
      </Grid>
    </Box>
  )
};

export default ADStats;
