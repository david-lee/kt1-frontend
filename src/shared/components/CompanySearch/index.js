import { Box, Grid, Typography } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import Dropdown from 'shared/components/Dropdown';
import SearchInput from './SearchInput';
import { searchOptions } from 'data/adOptions';
import { searchBy } from 'data/constants';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
// import { SET_VALUES } from 'data/actions';
// import { useAppContext } from 'shared/contexts/AppContext';
import path from 'data/routes';

const CompanySearch = ({ onReset, onSelectCompany, isDeleted, variant = "full" }) => {
  const [searchOption, setSearchOption] = useState(searchBy.name);
  const [companyList, setCompanyList] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const [selectedCompany, setSelectedCompany] = useState('');
  // const [_, dispatch] = useAppContext();

  const resetSearch = useCallback(() => {
    setCompanyList(null);
    setSelectedCompany('');
    onSelectCompany && onSelectCompany('');
    onReset && onReset();
  }, []);

  const selectCompany = (company) => {    
    if (location.pathname.includes(path.advertiser)) {
      navigate(`/s/${path.advertiser}/${company.userId}`, { state: company });
    } else {
      setSelectedCompany(company);
      onSelectCompany && onSelectCompany(company);
    }
  }

  useEffect(() => {
    if (isDeleted) navigate(`/s/${path.advertiser}`);
  }, [isDeleted, navigate]);

  // in the case that new company is selected
  useEffect(() => {
    if (params?.userId) {
      setCompanyList(null);
      setSelectedCompany('');
    }
  }, [params?.userId]);

  const padding = variant === "full" ? 50 : 0;

  return (
    <Box sx={{ margin: "0 auto", px: padding, width: "100%" }}>
      <Grid container alignItems="center" columnGap={2} flexWrap="nowrap">
        <Grid item xs={3.5}>
          <Dropdown label="Search By" options={searchOptions} noNone width="100%" 
            value={searchOption} onChange={e => setSearchOption(e.target.value)} 
          />
        </Grid>
        <Grid container item xs={8.5} alignItems="flex-end" flexWrap="nowrap" columnGap={2}>
          <SearchInput
            id="companySearch" 
            fullWidth
            onReset={resetSearch}
            onSearch={setCompanyList}
            type={searchOption}
            isDeleted={isDeleted}
          />
        </Grid>
      </Grid>

      {!selectedCompany && (
        <Grid container sx={{ height: 80, overflow: "auto", p: 1 }}>
          {
            companyList?.map((comp) => (
              <Grid key={comp.userId} item xs={12} onClick={() => selectCompany(comp)} sx={{ cursor: "pointer" }}>
                <Typography>{comp.primaryName} ({comp.ownerName} - {comp.userId})</Typography>
              </Grid>
            ))
          }
        </Grid>
      )}

      {selectedCompany && (
        <Grid container sx={{ mt: 1, backgroundColor: "lightgreen"}}>
          <Grid item xs={12}>
            <Typography>{selectedCompany.primaryName} ( {selectedCompany.ownerName} - {selectedCompany.userId} )</Typography>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}

export default CompanySearch;
