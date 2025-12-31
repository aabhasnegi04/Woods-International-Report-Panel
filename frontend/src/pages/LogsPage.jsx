import { Box, Button, Stack, Typography } from '@mui/material'
import ForestIcon from '@mui/icons-material/Forest'
import InventoryIcon from '@mui/icons-material/Inventory'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ReportRunner from '../shared/ReportRunner'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function LogsPage() {
  const [params, setParams] = useSearchParams()
  const selectedReport = params.get('report') || ''

  const reports = useMemo(() => [
    { key: 'current_log_stock', label: 'Current Log Stock', needsDateRange: false },
    { key: 'log_closing_stock', label: 'Log Closing Stock - As On Date', needsDateRange: true },
    { key: 'log_buying_summary', label: 'Log Buying Summary Month Wise', needsDateRange: false },
    { key: 'log_invoice_summary', label: 'Log Invoice Summary', needsDateRange: false },
    { key: 'log_cutting_summary', label: 'Log Cutting Summary', needsDateRange: false },
    // Add more log reports here in the future
  ], [])

  function openReport(key) {
    params.set('report', key)
    setParams(params, { replace: true })
  }

  function backToGrid() {
    params.delete('report')
    setParams(params, { replace: true })
  }

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {!selectedReport ? (
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FDF6E3 0%, #F5E6D3 100%)',
          p: { xs: 2, sm: 3, md: 4 }
        }}>
          <Stack spacing={{ xs: 2, md: 2.5 }} alignItems="center" sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
            <Stack spacing={0.5} alignItems="center">
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#8B4513', 
                  textAlign: 'center',
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  letterSpacing: -0.5
                }}
              >
                Log Management & Analytics
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#A0522D', 
                  textAlign: 'center',
                  fontSize: { xs: 13, md: 15 }
                }}
              >
                Select a log report to view detailed inventory analytics
              </Typography>
            </Stack>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 2.5 },
              width: '100%'
            }}>
              {reports.map((r) => {
                const Icon = (r.key === 'log_buying_summary' || r.key === 'log_invoice_summary') ? InventoryIcon : ForestIcon
                return (
                  <Box
                    key={r.key}
                    onClick={() => openReport(r.key)}
                    sx={{
                      background: 'white',
                      borderRadius: 2,
                      p: { xs: 2, md: 2.5 },
                      cursor: 'pointer',
                      border: '2px solid #DEB887',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(139, 69, 19, 0.2)',
                        borderColor: '#8B4513',
                        '& .icon-box': {
                          background: '#8B4513',
                          transform: 'scale(1.1)',
                          '& svg': {
                            color: 'white'
                          }
                        }
                      },
                      '&:active': {
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        className="icon-box"
                        sx={{
                          width: { xs: 40, md: 44 },
                          height: { xs: 40, md: 44 },
                          borderRadius: 2,
                          background: '#F5DEB3',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Icon sx={{ fontSize: { xs: 20, md: 22 }, color: '#8B4513', transition: 'color 0.3s ease' }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#8B4513',
                            fontSize: { xs: 13, md: 15 },
                            mb: 0.25,
                            lineHeight: 1.3
                          }}
                        >
                          {r.label}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#A0522D',
                            fontSize: { xs: 10, md: 11 }
                          }}
                        >
                          {r.needsDateRange ? 'Date range required' : 'No parameters'}
                        </Typography>
                      </Box>
                    </Stack>
                  </Box>
                )
              })}
            </Box>
          </Stack>
        </Box>
      ) : (
        <Box sx={{ width: '100%', minHeight: '100vh', m: 0, p: 0 }}>
          <Stack spacing={3} sx={{ width: '100%', m: 0 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', pt: 2, px: 0 }}>
              <Button 
                onClick={backToGrid} 
                variant="outlined"
                startIcon={<ArrowBackIcon />}
                sx={{ 
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  borderColor: '#8B4513',
                  color: '#8B4513',
                  fontSize: { xs: 14, md: 16 },
                  '&:hover': {
                    borderColor: '#A0522D',
                    background: 'rgba(139, 69, 19, 0.04)'
                  }
                }}
              >
                Back to Log Reports
              </Button>
            </Box>
            <ReportRunner selectedReport={selectedReport} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}