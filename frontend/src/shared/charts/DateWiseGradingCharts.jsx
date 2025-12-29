import { useMemo } from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts'
import AssessmentIcon from '@mui/icons-material/Assessment'

export default function DateWiseGradingCharts({ data }) {
  const thicknessData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    return data.recordsets[0].map(item => ({
      thickness: item.THICKNESS ? `${item.THICKNESS}mm` : 'N/A',
      'Total CBM': parseFloat(item.TOTAL_CBM || 0).toFixed(2),
      rawValue: parseFloat(item.TOTAL_CBM || 0)
    })).sort((a, b) => b.rawValue - a.rawValue)
  }, [data])

  const totalCBM = useMemo(() => 
    thicknessData.reduce((sum, item) => sum + item.rawValue, 0).toFixed(2), 
    [thicknessData]
  )

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #d1fae5 0%, #a7f3d0 50%, #6ee7b7 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #10b981 0%, #059669 50%, #047857 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <AssessmentIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Date Wise Grading
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Thickness analysis and CBM breakdown
        </Typography>
        {data?.metadata?.fromDate && data?.metadata?.toDate && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            flexWrap: 'wrap'
          }}>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 14, md: 16 }, 
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}>
              📅 {data.metadata.fromDate}
            </Typography>
            <Typography sx={{ color: 'white', fontSize: { xs: 14, md: 16 }, fontWeight: 700 }}>
              to
            </Typography>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 14, md: 16 }, 
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              px: 2,
              py: 0.5,
              borderRadius: 1
            }}>
              📅 {data.metadata.toDate}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Card */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Paper sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
          borderRadius: 0,
          boxShadow: '0 8px 24px rgba(5, 150, 105, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)',
          textAlign: 'center',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            Total CBM
          </Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: 36, md: 44 }, fontWeight: 900, lineHeight: 1 }}>
            {totalCBM}
          </Typography>
        </Paper>
      </Box>

      {/* Thickness vs Total CBM Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#047857', mb: 2, textAlign: 'center' }}>
          📊 Thickness vs Total CBM
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: '2px solid #a7f3d0',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
          boxShadow: '0 8px 24px rgba(4, 120, 87, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, thicknessData.length * 80), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={thicknessData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="thickness" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  width={40}
                  domain={[0, 'dataMax + 10']}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 12,
                    padding: '10px 14px'
                  }}
                  formatter={(value) => [value, 'Total CBM']}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
                />
                <Bar dataKey="Total CBM" fill="#10b981" name="Total CBM" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1, display: { xs: 'block', md: 'none' } }}>
          Swipe to see all thicknesses →
        </Typography>
      </Box>
    </Box>
  )
}
