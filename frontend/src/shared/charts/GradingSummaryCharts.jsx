import { useMemo, useState } from 'react'
import { Box, Paper, Typography, Stack, ToggleButton, ToggleButtonGroup } from '@mui/material'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import PercentIcon from '@mui/icons-material/Percent'
import ShowChartIcon from '@mui/icons-material/ShowChart'

export default function GradingSummaryCharts({ data }) {
  const [viewMode, setViewMode] = useState('absolute') // 'absolute' or 'percentage'

  // Prepare data for DATE vs GRADES chart (absolute values)
  const dateGradesData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    return data.recordsets[0].map(item => ({
      date: item.DATE ? new Date(item.DATE).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '',
      day: item.DAY || '',
      'GRADE-1': parseFloat(item['GRADE-1'] || 0).toFixed(2),
      'GRADE-2': parseFloat(item['GRADE-2'] || 0).toFixed(2),
      'GRADE-3': parseFloat(item['GRADE-3'] || 0).toFixed(2),
      'GRADE-4': parseFloat(item['GRADE-4'] || 0).toFixed(2),
      'GRADE-5': parseFloat(item['GRADE-5'] || 0).toFixed(2),
      'GRADE-6': parseFloat(item['GRADE-6'] || 0).toFixed(2),
      TOTAL: parseFloat(item.TOTAL || 0).toFixed(2),
    }))
  }, [data])

  // Prepare data for DATE vs GRADES chart (percentage values)
  const dateGradesPercentageData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    return data.recordsets[0].map(item => ({
      date: item.DATE ? new Date(item.DATE).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '',
      day: item.DAY || '',
      'GRADE-1': (parseFloat(item['GRADE-1P'] || 0) * 100).toFixed(2),
      'GRADE-2': (parseFloat(item['GRADE-2P'] || 0) * 100).toFixed(2),
      'GRADE-3': (parseFloat(item['GRADE-3P'] || 0) * 100).toFixed(2),
      'GRADE-4': (parseFloat(item['GRADE-4P'] || 0) * 100).toFixed(2),
      'GRADE-5': (parseFloat(item['GRADE-5P'] || 0) * 100).toFixed(2),
      'GRADE-6': (parseFloat(item['GRADE-6P'] || 0) * 100).toFixed(2),
    }))
  }, [data])

  // Choose which data to display based on view mode
  const displayData = viewMode === 'percentage' ? dateGradesPercentageData : dateGradesData

  // Prepare data for GRADES vs TOTAL chart (aggregate)
  const gradesTotalData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    const totals = {
      'GRADE-1': 0,
      'GRADE-2': 0,
      'GRADE-3': 0,
      'GRADE-4': 0,
      'GRADE-5': 0,
      'GRADE-6': 0,
    }
    data.recordsets[0].forEach(item => {
      totals['GRADE-1'] += parseFloat(item['GRADE-1'] || 0)
      totals['GRADE-2'] += parseFloat(item['GRADE-2'] || 0)
      totals['GRADE-3'] += parseFloat(item['GRADE-3'] || 0)
      totals['GRADE-4'] += parseFloat(item['GRADE-4'] || 0)
      totals['GRADE-5'] += parseFloat(item['GRADE-5'] || 0)
      totals['GRADE-6'] += parseFloat(item['GRADE-6'] || 0)
    })
    return Object.entries(totals).map(([grade, total]) => ({
      grade,
      'Total CBM': parseFloat(total).toFixed(2),
      rawValue: total
    }))
  }, [data])

  const grandTotal = useMemo(() => 
    gradesTotalData.reduce((sum, item) => sum + item.rawValue, 0).toFixed(2),
    [gradesTotalData]
  )

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #dbeafe 0%, #bfdbfe 50%, #93c5fd 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 50%, #1d4ed8 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <TrendingUpIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Grading Summary
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Grade-wise CBM analysis and trends
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
          background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
          borderRadius: 0,
          boxShadow: '0 8px 24px rgba(37, 99, 235, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)',
          textAlign: 'center',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            Total CBM (All Grades)
          </Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: 36, md: 44 }, fontWeight: 900, lineHeight: 1 }}>
            {grandTotal}
          </Typography>
        </Paper>
      </Box>

      {/* Chart 1: DATE vs GRADES (Line Chart) */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={2} sx={{ mb: 2 }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1e40af' }}>
            📈 Daily Grade Trends
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                px: { xs: 1.5, md: 2 },
                py: 0.5,
                fontSize: { xs: 11, md: 12 },
                fontWeight: 600,
                textTransform: 'none',
                border: '1px solid #93c5fd',
                color: '#1e40af',
                '&.Mui-selected': {
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                  }
                },
                '&:hover': {
                  background: '#dbeafe',
                }
              }
            }}
          >
            <ToggleButton value="absolute">
              <ShowChartIcon sx={{ fontSize: 16, mr: 0.5 }} />
              CBM
            </ToggleButton>
            <ToggleButton value="percentage">
              <PercentIcon sx={{ fontSize: 16, mr: 0.5 }} />
              Percentage
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          boxShadow: '0 8px 24px rgba(29, 78, 216, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(800, displayData.length * 60), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={displayData} 
                margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
                style={{ border: 'none' }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} />
                <defs>
                  <clipPath id="chart-clip">
                    <rect x="0" y="0" width="100%" height="100%" stroke="none" />
                  </clipPath>
                </defs>
                <XAxis 
                  dataKey="date" 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  width={50}
                  label={viewMode === 'percentage' ? { value: '%', angle: -90, position: 'insideLeft', style: { fontSize: 11, fill: '#64748b' } } : undefined}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '2px solid #3b82f6',
                    borderRadius: 12,
                    fontSize: 13,
                    padding: '12px 16px',
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.3)',
                    fontWeight: 600
                  }}
                  cursor={{ stroke: 'rgba(59, 130, 246, 0.3)', strokeWidth: 2 }}
                  labelStyle={{ 
                    color: '#1e40af', 
                    fontWeight: 700, 
                    fontSize: 14,
                    marginBottom: 8,
                    borderBottom: '2px solid #93c5fd',
                    paddingBottom: 6
                  }}
                  formatter={(value, name) => [
                    viewMode === 'percentage' ? `${value}%` : `${value} CBM`,
                    name.replace('GRADE-', 'Grade ')
                  ]}
                  labelFormatter={(label) => `📅 ${label}`}
                />
                <Legend 
                  wrapperStyle={{ fontSize: 13, fontWeight: 700 }}
                  formatter={(value) => value.replace('GRADE-', 'Grade ')}
                />
                <Line type="monotone" dataKey="GRADE-1" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GRADE-2" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GRADE-3" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GRADE-4" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GRADE-5" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="GRADE-6" stroke="#ec4899" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1, display: { xs: 'block', md: 'none' } }}>
          Swipe to see all dates →
        </Typography>
      </Box>

      {/* Chart 2: GRADES vs TOTAL (Bar Chart) */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#1e40af', mb: 2, textAlign: 'center' }}>
          📊 Total CBM by Grade
        </Typography>
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderRadius: 0, 
          border: 'none',
          background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
          boxShadow: '0 8px 24px rgba(29, 78, 216, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: '100%', height: { xs: 350, md: 400 } }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradesTotalData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" vertical={false} />
                <XAxis 
                  dataKey="grade" 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="transparent"
                  axisLine={false}
                  tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }}
                  tickLine={false}
                  width={50}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 12,
                    padding: '10px 14px'
                  }}
                  cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
                />
                <Bar dataKey="Total CBM" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      </Box>
    </Box>
  )
}
