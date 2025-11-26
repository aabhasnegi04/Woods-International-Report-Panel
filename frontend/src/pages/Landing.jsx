import { Box, Stack, Typography, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Assessment } from '@mui/icons-material'

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
          Access comprehensive reports, analytics, and insights for Woods International operations
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<Assessment sx={{ fontSize: { xs: 20, md: 24 } }} />}
          onClick={() => navigate('/reports')}
          sx={{
            mt: { xs: 1, md: 2 },
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
      </Stack>
    </Box>
  )
}


