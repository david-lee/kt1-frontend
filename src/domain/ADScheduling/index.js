import React, { useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { addDays, subDays } from 'date-fns';
import ADDate from 'shared/components/ADDate';
import MonthlyView from './MonthlyView';
import OneTimeView from './OneTimeView';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import { deptType } from 'data/constants';

const ADScheduling = () => {
  const { adType, scheduleType } = useParams();
  const [adDate, setAdDate] = useState(() => new Date());
  const [sizeFilter, setSizeFilter] = useState('');
  // TODO: need it? If don't show any fixed ads here, no need to have it
  const [nonFilterSize, setNotFiltersize] = useState({
    belt: false,
    pop: false,
  });
  const { user: { dept }} = useUserAuth();
  const navigate = useNavigate();

  const handleDateChange = (date) => {
    setAdDate(date);
  }
  const handleSizeFilter = (e, c) => {
    setSizeFilter(e.target.value);
    // setShortSize(shortSize);
  }

  const handleNonFilterChange = (e) => {
    setNotFiltersize((state) => ({
      ...state,
      [e.target.name]: e.target.checked,
    }));
  }

  const { belt, pop } = nonFilterSize;
  
  if (dept.toLowerCase() === deptType.account || dept.toLowerCase() === deptType.sub) {
    navigate('/s/dashboard', { replace: true });
    return null;
  }

  return (
    <Grid container>
      {scheduleType === "1" && (
        <Grid item container xs={12} justifyContent="center" columnGap={4} alignItems="center">
          <IconButton onClick={() => setAdDate(subDays(adDate, 1))} color="success">
            <ArrowBackIosIcon />
          </IconButton>

          <ADDate label="AD Date" value={adDate} onChange={handleDateChange} />
          
          <IconButton onClick={() => setAdDate(addDays(adDate, 1))} color="success">
            <ArrowForwardIosIcon />
          </IconButton>
        </Grid>
      )}
      {/* TODO: discuss if we want to show fixed ads here */}
        {/* <Grid item container xs={6} justifyContent="flex-end" alignItems="center">
          <Grid item sx={{ mr: 2 }}>
            <FormControl sx={{ top: "6px" }} variant="standard">
              <FormGroup row>
                <FormControlLabel
                  label="Belt"
                  control={<Checkbox checked={belt} onChange={handleNonFilterChange} name="belt" />}
                />
                <FormControlLabel
                  label="Pop"
                  control={<Checkbox checked={pop} onChange={handleNonFilterChange} name="pop" />}
                />
              </FormGroup>
            </FormControl>
          </Grid>

          <Grid item>
            <ADTypeSize value={sizeFilter} onChange={handleSizeFilter} type={adType} pageView /> 
          </Grid>
        </Grid> */} 

      <Grid item container xs={12}>
        {scheduleType === '1' ? (
          <OneTimeView adDate={adDate} sizeFilter={sizeFilter} nonFilterSize={nonFilterSize} adType={adType} />
        ) : (
          <MonthlyView />
        )}
      </Grid>
    </Grid> 
  )
}

export default ADScheduling;
