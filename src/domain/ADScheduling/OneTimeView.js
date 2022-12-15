import React, { useMemo, useEffect, useState } from 'react';
import { Box, Backdrop, CircularProgress, Grid } from '@mui/material';
import { green } from '@mui/material/colors';
import {scheduleType,  DADPagesLayout } from 'data/adOptions';
import PageCell from './PageCell';
import AddDialog from './AddDialog';
import SnackbarMessage from 'shared/components/SnackbarMessage';
import useSales from 'shared/hooks/useSales';

const OneTimeView = ({ adDate, sizeFilter, nonFilterSize, adType }) => {
  const [ads, setADs] = useState(null);
  const [clickedPage, setClickedPage] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  const { isLoading, fetchOneTimeADs } = useSales();
  
  const pages = useMemo(() => adType === scheduleType.oneTimeDAD ? DADPagesLayout : Array.from({length: 72}, (_, i) => i+1), [adType]);
  
  const onCloseDialog = () => setIsOpen(false);

  const handlePageClick = (page) => {
    setClickedPage(page);

    let flAD;
    let hfADs = [];
    let qtADs = [];

    // validation check if a new AD can be added
    ads[page]?.forEach(ad => {
      const size = ad.size.toUpperCase();
      if (size === 'FL') flAD = ad;
      if (size === 'HF' || size === 'HP' || size === 'HL') hfADs.push(ad);
      if (size ==='1/4') qtADs.push(ad);
    });

    // not allow to add
    // if one full size or two half sizes exist,
    // if one half size and two quater sizes exist,
    // if four quater sizes exist
    if ((flAD || hfADs.length === 2) || (hfADs.length === 1 && qtADs.length === 2) || (qtADs.length === 4)) {
      setError(`There is no space for the page ${page}`);
      return;
    } else {
      setIsOpen(true);
    }
  };

  const handleOnSaved = () => {
    fetchOneTimeADs(adDate, onFetch);
  }

  const handleOnError = (e) => {
    console.log("Error on saving: ", e);
  }

  const onFetch = (resp) => {
    const mappedData = {};

    resp.main.forEach((ad) => {
      if (ad.scheduleTypeCode === 1) {
        if (mappedData.hasOwnProperty(ad.page)) {
          mappedData[ad.page].push(ad);
        } else {
          mappedData[ad.page] = [ad];
        }
      }
    });

    resp.randomDates.forEach((random) => {
      if (mappedData.hasOwnProperty(random.page)) {
        mappedData[random.page].push(random);
      } else {
        mappedData[random.page] = [random];
      }
    });

    setADs(mappedData);
  };

  useEffect(() => { 
    fetchOneTimeADs(adDate, onFetch); 
  }, [ adDate, fetchOneTimeADs ]);

  if (!ads) return <div>Loading...</div>;

  return (
    <>
      <SnackbarMessage errorMessage={error} onClose={() => setError('')} />

      <Backdrop sx={{ zIndex: 100 }} open={isLoading}><CircularProgress color="inherit" /></Backdrop>
      
      {
        pages.map((page) => {
          return (
            <Grid
              key={page} 
              item xs={3} 
              sx={{ p: 0.5, height: 140 }}
            >
              <PageCell
                page={page}
                bgcolor={green[800]} 
                ad={ads[page]} 
                sizeFilter={sizeFilter}
                nonFilterSize={nonFilterSize}
                onClickPage={handlePageClick}
              />
            </Grid>
          )
        })
      }

      {isOpen && 
        <AddDialog isOpen={isOpen} adDate={adDate} page={clickedPage} adType={adType}
          onClose={onCloseDialog}
          onSaved={handleOnSaved}
          onError={handleOnError}
        />
      }
    </>
  )
}

export default OneTimeView;
