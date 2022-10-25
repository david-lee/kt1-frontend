import React, { useState } from 'react';
import IconButton from '@mui/material/IconButton';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import LockResetIcon from '@mui/icons-material/LockReset';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Box, Paper, Typography, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from 'assets/tktd-logo-bottom.png';
import api from '../../appConfig/restAPIs';

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();
  const { spaces: { headerHeight }, spacing } = useTheme();

  const handleClickShowPassword = () => {
    setShowPassword(prevShowPassword => !prevShowPassword);
  }
  const handleMouseDownPassword = (e) => {
    e.preventDefault();
  };
  const resetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);

    axios.post(api.resetPassword, { loginId, password }).then(() => {
      setIsLoading(false);
      navigate('/');
    });
  }

  return (
    <React.Fragment>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          position: "fixed",
          top: 0,
          left: 0,
          px: 3,
          py: 1,
          width: "100%",
          height: spacing(headerHeight),
          backgroundColor: "primary.kt1Green",
          boxShadow: 4,
          color: "white",
          transition: "width 0.2s",
          zIndex: 998,
        }}
      >
        <Box
          sx={{
            display: "flex",
            position: "relative",
            alignItems: "center",
            height: "100%",
            ml: -2,
          }}
        >
          <img src={logo} width="220px" alt="The Korea Times Daily Logo" />
        </Box>
      </Box>

      <Box sx={{ maxWidth: 400, margin: "250px auto" }}>
        <Paper sx={{ p: 10 }}>
          <Typography sx={{ mb: 5 }}>
            Please enter your login id IT team provided.
          </Typography>

          <FormControl sx={{ mb: 4, width: '100%' }} variant="standard">
            <InputLabel htmlFor="login-id">
              <Typography variant="body2">Login ID</Typography>
            </InputLabel>
            <Input id="login-id" value={loginId} onChange={(e) => setLoginId(e.target.value)} />
          </FormControl>    
          <FormControl sx={{ width: '100%' }} variant="standard">
            <InputLabel htmlFor="password">
              <Typography variant="body2">Password</Typography>
            </InputLabel>
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          
          <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
            <LoadingButton
              disabled={!(loginId && password)}
              loading={isLoading}
              loadingPosition="start" 
              startIcon={<LockResetIcon />}
              variant="contained"
              onClick={resetPassword}
            >
              Reset
            </LoadingButton>          
          </Box>
        </Paper>
      </Box>
    </React.Fragment>
  );
}

export default ResetPassword;
