import { Box, IconButton, TextField } from '@mui/material';
import ReplayIcon from '@mui/icons-material/Replay';
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import api from '../../../appConfig/restAPIs';
import useDebounce from 'shared/hooks/useDebounce';
import { searchBy } from 'data/constants';
import { useParams } from 'react-router-dom';

const reqOptions = {
  [searchBy.name]: { param: 'primaryName', func: (term) =>  term.length >= 3 },
  [searchBy.id]: { param: 'userId', func: (term) => term.length >= 4 },
  [searchBy.ownerName]: { param: 'ownerName', func: (term) => term.length >= 3 },
  [searchBy.phoneNumber]: { param: 'phoneNumber', func: (term) => term.length >= 6 },
  [searchBy.email]: { param: 'email', func: (term) => term.length >= 5 && term.indexOf("@") > 0 },
  [searchBy.oldId]: { param: 'OldCustomerId', func: (term) => term.length >= 4 },
}

const CompanySearch = ({ 
  id,
  fullWidth = false,
  label = "Search company",
  isDeleted,
  onSearch,
  onReset,
  sx,
  type = searchBy.name,
  variant = "standard",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 300);
  const [isLoading, setIsLoading] = useState(false);
  const params = useParams();

  const resetHandler = useCallback(() => {
    setSearchTerm("");
    onReset && onReset();
  }, []);

  useEffect(() => {
    if (params?.userId) {
      setSearchTerm("");
    }
  }, [params]);

  useEffect(() => {
    if (isDeleted) resetHandler();
  }, [isDeleted, resetHandler]);

  useEffect(() => {
    const controller = new AbortController();
    const searchType = reqOptions[type];
    const callSearch = searchType.func(debouncedTerm);

    if (callSearch) {
      setIsLoading(true);

      axios.post(api.companySearch, { [searchType.param]: debouncedTerm }, { signal: controller.signal })
        .then(({ data }) => {
          onSearch(data);
        })
        .catch((error) => {
          console.log("SearchInput: ", error.message);
        })
        .finally(() => { setIsLoading(false); })
    } 

    return () => {
      setIsLoading(false)
      controller.abort();
    }
  }, [debouncedTerm, type, onSearch]);

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  }

  return (
    <Box sx={{ pl: 4, position: "relative", width: "100%", display: 'flex' }}>
      <TextField {...{ id, label, variant, sx, fullWidth }}
        value={searchTerm} onChange={handleChange}
      />
      {isLoading && <CircularProgress size={20} sx={{ position: "absolute", bottom: "4px", right: "40px" }} />}

      <IconButton sx={{ top: 8 }} onClick={resetHandler}>
        <ReplayIcon sx={{ cursor: "pointer" }} />
      </IconButton>
    </Box>
  );
}

export default CompanySearch;
