import { Box, Stack, Typography, Button, Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Assessment, Forest } from '@mui/icons-material'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#FFFFFF',
      overflow: 'auto',
      py: { xs: 4, md: 0 }
    }}>
      <Stack spacing={{ xs: 4, md: 5 }} alignItems="center" sx={{ textAlign: 'center', maxWidth: { xs: '100%', md: 700 }, px: { xs: 2, sm: 3 }, width: '100%' }}>
        <Box
          component="img"
          src="/wood_logo.png"
          alt="Woods International Gabon"
          sx={{ 
            height: { xs: 80, sm: 100, md: 120 },
            width: 'auto',
            objectFit: 'contain',
            maxWidth: '90%'
          }}
        />
        
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 800, 
            fontSize: { xs: 24, sm: 32, md: 42 },
            color: '#0F0F0F',
            letterSpacing: -0.5,
            px: { xs: 1, sm: 0 }
          }}
        >
          Report Panel & Analytics
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#525252',
            fontWeight: 400,
            lineHeight: 1.6,
            fontSize: { xs: 14, sm: 16, md: 18 },
            px: { xs: 1, sm: 0 }
          }}
        >
          Access comprehensive reports, analytics, and log management for Woods International operations
        </Typography>

        <Grid container spacing={3} sx={{ mt: 2, maxWidth: 600 }}>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Assessment sx={{ fontSize: { xs: 20, md: 24 } }} />}
              onClick={() => navigate('/reports')}
              sx={{
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 1.75 },
                fontSize: { xs: 14, sm: 15, md: 16 },
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                background: '#2C2416',
                color: 'white',
                boxShadow: '0 4px 14px rgba(44, 36, 22, 0.25)',
                '&:hover': {
                  background: '#1F1810',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(44, 36, 22, 0.35)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              View Reports
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Button
              variant="contained"
              size="large"
              fullWidth
              startIcon={<Forest sx={{ fontSize: { xs: 20, md: 24 } }} />}
              onClick={() => navigate('/logs')}
              sx={{
                px: { xs: 4, md: 5 },
                py: { xs: 1.5, md: 1.75 },
                fontSize: { xs: 14, sm: 15, md: 16 },
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: 2.5,
                background: '#8B4513',
                color: 'white',
                boxShadow: '0 4px 14px rgba(139, 69, 19, 0.25)',
                '&:hover': {
                  background: '#A0522D',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(139, 69, 19, 0.35)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              Log Management
            </Button>
          </Grid>
        </Grid>
      </Stack>
    </Box>
  )
}


