import { Box, Button, Grid, Stack, Typography, Fab } from '@mui/material'
import { alpha } from '@mui/material/styles'
import AnalyticsIcon from '@mui/icons-material/Analytics'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ReportRunner from '../shared/ReportRunner'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export default function ReportsPage() {
  const [params, setParams] = useSearchParams()
  const selectedReport = params.get('report') || ''

  const reports = useMemo(() => [
    { key: 'container_loading_report', label: 'Container Loading', needsDateRange: false },
    { key: 'container_month_wise', label: 'Container Month Wise', needsDateRange: false },
  ], [])

  function accentFor(key) {
    const map = {
      container_loading_report: { main: '#f59e0b', alt: '#ef4444', Icon: AnalyticsIcon },
      container_month_wise: { main: '#8b5cf6', alt: '#ec4899', Icon: TrendingUpIcon },
    }
    return map[key] || { main: '#f59e0b', alt: '#ef4444', Icon: AnalyticsIcon }
  }

  function openReport(key) {
    params.set('report', key)
    setParams(params, { replace: true })
  }

  function backToGrid() {
    params.delete('report')
    setParams(params, { replace: true })
  }

  const selectedReportLabel = useMemo(() => {
    const found = reports.find(r => r.key === selectedReport)
    return found?.label || ''
  }, [reports, selectedReport])

  return (
    <Box sx={{ minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
      {!selectedReport ? (
        <Box sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #FAFAFA 0%, #F5F5F5 100%)',
          p: { xs: 2, sm: 3, md: 4 }
        }}>
          <Stack spacing={{ xs: 2, md: 2.5 }} alignItems="center" sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
            <Stack spacing={0.5} alignItems="center">
              <Typography 
                variant="h3" 
                sx={{ 
                  fontWeight: 800, 
                  color: '#0F0F0F', 
                  textAlign: 'center',
                  fontSize: { xs: 20, sm: 24, md: 28 },
                  letterSpacing: -0.5
                }}
              >
                Reports & Analytics
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  color: '#525252', 
                  textAlign: 'center',
                  fontSize: { xs: 13, md: 15 }
                }}
              >
                Select a report to view detailed analytics
              </Typography>
            </Stack>

            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
              gap: { xs: 1.5, sm: 2, md: 2.5 },
              width: '100%'
            }}>
              {reports.map((r) => {
                const { main, alt, Icon } = accentFor(r.key)
                return (
                  <Box
                    key={r.key}
                    onClick={() => openReport(r.key)}
                    sx={{
                      background: 'white',
                      borderRadius: 2,
                      p: { xs: 2, md: 2.5 },
                      cursor: 'pointer',
                      border: '2px solid #E5E7EB',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 24px rgba(0,0,0,0.1)',
                        borderColor: '#2C2416',
                        '& .icon-box': {
                          background: '#2C2416',
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
                          background: '#F5F5F5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          transition: 'all 0.3s ease'
                        }}
                      >
                        <Icon sx={{ fontSize: { xs: 20, md: 22 }, color: '#2C2416', transition: 'color 0.3s ease' }} />
                      </Box>
                      <Box sx={{ minWidth: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontWeight: 700, 
                            color: '#0F0F0F',
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
                            color: '#737373',
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
                  borderColor: '#2C2416',
                  color: '#2C2416',
                  fontSize: { xs: 14, md: 16 },
                  '&:hover': {
                    borderColor: '#1F1810',
                    background: 'rgba(44, 36, 22, 0.04)'
                  }
                }}
              >
                Back to Reports
              </Button>
            </Box>
            <ReportRunner selectedReport={selectedReport} />
          </Stack>
        </Box>
      )}
    </Box>
  )
}
