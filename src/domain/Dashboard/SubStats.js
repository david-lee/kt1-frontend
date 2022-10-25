import { Box, Grid } from '@mui/material';
import React from 'react';
import {
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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

const SubStats = () => {
  return (
    <Box>
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={3}>
          <StatsCard label="Total Subscribers" stat={15000} />
        </Grid>
        <Grid item xs={3}>
          <StatsCard label="New in April" stat={20} />
        </Grid>
        <Grid item xs={3}>
          <StatsCard label="Termination in April" stat={3} />
        </Grid>
        <Grid item xs={3}>
          <StatsCard label="Renewal in April" stat={15} />
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
                <linearGradient id="colorSub" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
                </linearGradient>
              </defs>            
              <XAxis dataKey="name" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="amt" stroke="#82ca9d" fillOpacity={1} fill="url(#colorSub)" />
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

export default SubStats;
