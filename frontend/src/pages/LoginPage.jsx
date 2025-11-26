import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Fade
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Login as LoginIcon,
  Person as PersonIcon,
  Lock as LockIcon
} from '@mui/icons-material';

const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (error) setError('');
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let apiBase = '';
      if (typeof window !== 'undefined') {
        const host = window.location.hostname;
        if (host === 'report.akstrends.in' || host.endsWith('.report.akstrends.in')) {
          apiBase = 'https://adm.akstrends.in';
        }
      }

      const response = await fetch(`${apiBase}/api/exec`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          procedure: 'proc_logindone',
          params: {
            usrname: formData.username,
            passw: formData.password
          }
        })
      });

      const result = await response.json();

      if (response.ok && result.recordsets && result.recordsets[0] && result.recordsets[0].length > 0) {
        const user = result.recordsets[0][0];
        onLogin({
          username: user.Username,
          role: user.Role,
          isAuthenticated: true,
          userData: user
        });
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        height: { xs: 'auto', md: '100vh' },
        display: 'flex',
        position: { xs: 'relative', md: 'fixed' },
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: { xs: 'auto', md: 'hidden' },
        background: '#FFFFFF',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '50%',
          height: '100%',
          background: 'linear-gradient(135deg, #2C2416 0%, #3E2F20 50%, #4A3828 100%)',
          display: { xs: 'none', md: 'block' }
        }
      }}
    >
      {/* Left Side - Branding */}
      <Box
        sx={{
          flex: 1,
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 6,
          position: 'relative',
          zIndex: 1,
          overflow: 'hidden'
        }}
      >
        <Fade in timeout={1000}>
          <Box sx={{ textAlign: 'center', maxWidth: 480 }}>
            <Box
              component="img"
              src="/wood_logo.png"
              alt="Woods International Gabon"
              sx={{
                height: 140,
                width: 'auto',
                objectFit: 'contain',
                mb: 6,
                maxWidth: '100%'
              }}
            />
            <Typography
              variant="h6"
              sx={{
                color: '#D4A574',
                fontWeight: 600,
                mb: 5,
                fontSize: 18,
                letterSpacing: 3,
                textTransform: 'uppercase'
              }}
            >
              Gabon
            </Typography>
            <Box
              sx={{
                width: 60,
                height: 3,
                background: '#C4A57B',
                margin: '0 auto 40px',
                borderRadius: 2
              }}
            />
            <Typography
              variant="body1"
              sx={{
                color: '#B8A68D',
                fontSize: 16,
                lineHeight: 1.8,
                fontWeight: 300
              }}
            >
              Professional wood cutting and manufacturing solutions.
              <br />
              Access your comprehensive reporting and analytics dashboard.
            </Typography>
          </Box>
        </Fade>
      </Box>

      {/* Right Side - Login Form */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.8 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: { xs: 2, sm: 4, md: 6 },
          position: 'relative',
          zIndex: 1,
          overflow: 'auto',
          minHeight: '100vh'
        }}
      >
        <Fade in timeout={1200}>
          <Box
            sx={{
              width: '100%',
              maxWidth: { xs: '100%', sm: 460 },
              background: '#FFFFFF',
              borderRadius: 0,
              padding: { xs: 3, sm: 5, md: 6 },
              boxShadow: { xs: 'none', md: '-30px 0 80px rgba(0, 0, 0, 0.12)' },
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: { xs: '100vh', sm: 'auto' }
            }}
          >
            {/* Mobile Logo */}
            <Box sx={{ display: { xs: 'block', md: 'none' }, textAlign: 'center', mb: { xs: 4, sm: 6 } }}>
              <Box
                component="img"
                src="/wood_logo.png"
                alt="Woods International Gabon"
                sx={{
                  height: { xs: 120, sm: 100 },
                  width: 'auto',
                  objectFit: 'contain',
                  mb: { xs: 1, sm: 2 },
                  maxWidth: '90%'
                }}
              />
            </Box>

            {/* Form Header */}
            <Box sx={{ mb: { xs: 4, sm: 4, md: 5 }, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 800,
                  color: '#0F0F0F',
                  mb: { xs: 1.5, sm: 1.5, md: 2 },
                  fontSize: { xs: 28, sm: 32, md: 38 },
                  letterSpacing: { xs: -0.5, md: -1 },
                  lineHeight: 1.1
                }}
              >
                Welcome Back
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  color: '#525252',
                  fontSize: { xs: 15, sm: 15, md: 16 },
                  fontWeight: 500,
                  lineHeight: 1.6
                }}
              >
                Sign in to access your report panel
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3, 
                    borderRadius: 2,
                    backgroundColor: '#FEF2F2',
                    border: '1px solid #FCA5A5',
                    color: '#991B1B',
                    '& .MuiAlert-icon': {
                      color: '#DC2626'
                    }
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={{ xs: 3, sm: 3 }}>
                <TextField
                  fullWidth
                  label="Username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="username"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      fontSize: 16,
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0D0',
                        borderWidth: 1.5
                      },
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A0A0A0'
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2C2416',
                          borderWidth: 2
                        }
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '14px', sm: '16.5px 14px' },
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px #FFFFFF inset',
                        WebkitTextFillColor: '#000000'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#757575',
                      fontWeight: 600,
                      fontSize: { xs: 14, sm: 15 },
                      '&.Mui-focused': {
                        color: '#2C2416',
                        fontWeight: 700
                      }
                    },
                    '& .MuiInputAdornment-root': {
                      marginRight: 1
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon sx={{ color: '#424242', fontSize: { xs: 20, sm: 20 } }} />
                      </InputAdornment>
                    )
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      transition: 'all 0.2s ease',
                      fontSize: 16,
                      fontWeight: 500,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#D0D0D0',
                        borderWidth: 1.5
                      },
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#A0A0A0'
                        }
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#2C2416',
                          borderWidth: 2
                        }
                      }
                    },
                    '& .MuiOutlinedInput-input': {
                      padding: { xs: '14px', sm: '16.5px 14px' },
                      '&:-webkit-autofill': {
                        WebkitBoxShadow: '0 0 0 100px #FFFFFF inset',
                        WebkitTextFillColor: '#000000'
                      }
                    },
                    '& .MuiInputLabel-root': {
                      color: '#757575',
                      fontWeight: 600,
                      fontSize: { xs: 14, sm: 15 },
                      '&.Mui-focused': {
                        color: '#2C2416',
                        fontWeight: 700
                      }
                    },
                    '& .MuiInputAdornment-root': {
                      marginRight: 1
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon sx={{ color: '#424242', fontSize: { xs: 20, sm: 20 } }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePassword}
                          edge="end"
                          disabled={loading}
                          size="small"
                          sx={{ color: '#424242', marginRight: -0.5 }}
                        >
                          {showPassword ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    )
                  }}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !formData.username || !formData.password}
                  startIcon={loading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <LoginIcon sx={{ fontSize: { xs: 20, sm: 20 } }} />}
                  sx={{
                    py: { xs: 1.75, sm: 2 },
                    borderRadius: 2.5,
                    fontSize: { xs: 15, sm: 16 },
                    fontWeight: 700,
                    textTransform: 'none',
                    background: '#2C2416',
                    boxShadow: '0 4px 14px rgba(44, 36, 22, 0.25)',
                    border: 'none',
                    color: '#FFFFFF',
                    letterSpacing: 0.3,
                    '&:hover': {
                      background: '#1F1810',
                      boxShadow: '0 6px 20px rgba(44, 36, 22, 0.35)',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      transform: 'translateY(0)',
                      boxShadow: '0 2px 8px rgba(44, 36, 22, 0.2)'
                    },
                    '&:disabled': {
                      background: '#E0E0E0',
                      color: '#9E9E9E',
                      boxShadow: 'none'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </Stack>
            </Box>

            {/* Footer */}
            <Box sx={{ textAlign: 'center', mt: { xs: 4, sm: 5, md: 6 }, pt: { xs: 3, sm: 4, md: 5 }, borderTop: '2px solid #F0F0F0' }}>
              <Typography variant="body2" sx={{ color: '#757575', fontSize: { xs: 11, sm: 12, md: 13 }, fontWeight: 600, lineHeight: 1.5 }}>
                🔒 Secure access to Woods International Report Panel
              </Typography>
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default LoginPage;
