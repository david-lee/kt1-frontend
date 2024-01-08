import { Box, Grid, Tooltip, Typography } from '@mui/material';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { displaySize, roleType } from 'data/constants';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import { numberWithCommas } from 'shared/utils';
import path from 'data/routes';
import LooksOneIcon from '@mui/icons-material/LooksOne';

const sizeColor = {
  'FL': "#f44336",
  'HF': "#e57373",
  '1/4': "#ffa726",
  '1/8': "#29b6f6" ,
  '1/16': "#66bb6a",
  'BT': "#ce93d8",
  'C1': "#e3f2fd",
  'C2': "#90caf9",
  'C4': "#42a5f5",
  'C6': "#f3e5f5",
  'C8': "#ab47bc",
  'HP': "#0288d1",
  'HL': "#388e3c",
  'QP': "#f57c00",
  'QL': "#4fc3f7",
  'SP': "#9e9e9e",   
};

const PageCell = ({ bgcolor, page, ad, sizeFilter, nonFilterSize, onClickPage }) => {
  const { user: { role }} = useUserAuth();
  const navigation = useNavigate();

  const gotoCompany = useCallback((companyId) => {
    navigation(`/s/${path.advertiser}/${companyId}/2`);
  }, []);

  const isDirector = role === roleType.director;

  return (
    <Box sx={{
        position: "relative", 
        height: "100%",
        border: "1px solid lightgray",
        px: 2, py: 1,
      }}
    >
      <Box onClick={isDirector ? null : () => onClickPage(page)}
        sx={{
          position: 'absolute', right: 8, display: "flex", justifyContent: "flex-end", 
          cursor: isDirector ? "inherit" : "pointer" 
        }}
      >
        <Box
          sx={{
            position: "relative", top: -4, right: -8, textAlign: "center",
            px: .5, minWidth: 24, minHeight: 20,
            bgcolor, color: "white"
          }}
        >
          {page}
        </Box>
      </Box>
      <Grid container sx={{ maxHeight: '100%', overflow: "auto", pr: 5 }}>
        {
          ad?.map(({size, sizeCode, adId, company, companyId, cost, taxAmount, color, adTitle, statusCode, pAdId}, index) => {
            if (sizeFilter && sizeCode !== displaySize.bt && 
                sizeCode !== displaySize.pp && sizeFilter !== sizeCode) return null;
            
            if ((!nonFilterSize.belt && sizeCode === displaySize.bt) || (!nonFilterSize.pop && sizeCode === displaySize.pp)) return null;

            return (
              <Grid key={index} item xs={12} sx={{ bgcolor: color ? "inherit" : "rgba(220,220,220, .3)", cursor: "pointer" }}>
                <Tooltip arrow title={pAdId != null ? `${pAdId}: ${adId}` : `${adId}: $${numberWithCommas(cost)}, $${numberWithCommas(taxAmount)}`}>
                  <Typography variant="body2" onClick={() => gotoCompany(companyId)} sx={{textDecoration: statusCode === 2191 ? "underline" : ""}}>
                    <Box component="span" sx={{ color: sizeColor[size], fontWeight: 600 }}>
                      {size}:
                    </Box> {company} ({`${adTitle || ''}`}) {pAdId != null && (<LooksOneIcon />)}
                  </Typography>
                </Tooltip>
              </Grid>
            )
          })
        }
      </Grid>
    </Box>
  )
}

export default PageCell;
