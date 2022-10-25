import React, { useEffect, useState } from 'react';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import logo from 'assets/tktd-logo.png';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useUserAuth } from 'shared/contexts/UserAuthContext';
import path from '../../data/routes';

const Copyright = (props) => {
  return (
    <Typography
    variant="body2"
    color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://koreatimes.net">
        Koreatimes.net
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const Login = () => {
  // TODO: move to AppState
  const [isLoading, setIsLoading] = useState(false);
  
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const { error, user, login } = useUserAuth();
  const navigate = useNavigate();
  
  // it could be redirected from other than dashboard like /s/ad
  const { state } = useLocation();
  const nextPath = state?.path || '/s/dashboard';

  const handleSubmit = (event) => {
    setIsLoading(true);
    event.preventDefault();

    login({ loginId, password });
  };

  const resetPassword = (e) => {
    e.preventDefault();
    navigate(path.resetPassword);
  }

  useEffect(() => {
    console.log('Error in Login: ', error);
    setIsLoading(false);
  }, [error]);

  if (user?.authToken) {
    return <Navigate to={nextPath} replace/>
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={logo} alt="The Korea Times Daily Logo" />

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="loginId"
            label="Login ID"
            name="loginId"
            value={loginId}
            onChange={(e) => setLoginId(e.target.value)}
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!(loginId && password)}
            loading={isLoading}
          >
            Sign In
          </LoadingButton>
          {!isLoading && <Typography variant="body2" color={'error'}>{error}</Typography>}
          <Grid container>
            <Grid item xs>
              <Link component="button" variant="body2" onClick={resetPassword}>
                Reset password
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
      <Copyright sx={{ mt: 8, mb: 4 }} />
    </Container>
  );
}

export default Login;