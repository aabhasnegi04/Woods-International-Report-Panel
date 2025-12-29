import { useMemo } from 'react'
import { Box, Paper, Typography, Stack } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'

export default function ContainerMonthWiseCharts({ data, year }) {
  const monthlyData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    const monthOrder = {
      'Jan': 1, 'January': 1,
      'Feb': 2, 'February': 2,
      'Mar': 3, 'March': 3,
      'Apr': 4, 'April': 4,
      'May': 5,
      'Jun': 6, 'June': 6,
      'Jul': 7, 'July': 7,
      'Aug': 8, 'August': 8,
      'Sep': 9, 'September': 9,
      'Oct': 10, 'October': 10,
      'Nov': 11, 'November': 11,
      'Dec': 12, 'December': 12
    }
    const mapped = data.recordsets[0].map(item => ({
      month: item.MONTHS || item.LOADING_MONTH || '',
      'Containers': item.NO_OF_CONTAINER || 0,
      monthOrder: monthOrder[item.MONTHS || item.LOADING_MONTH || ''] || 99
    }))
    return mapped.sort((a, b) => a.monthOrder - b.monthOrder)
  }, [data])

  const totalContainers = useMemo(() => 
    monthlyData.reduce((sum, item) => sum + item['Containers'], 0), 
    [monthlyData]
  )

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #ddd6fe 0%, #fae8ff 50%, #fce7f3 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 50%, #ec4899 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(139, 92, 246, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <CalendarMonthIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Container Month Wise
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Year {year} monthly breakdown
        </Typography>
      </Box>

      {/* Summary Card */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Paper sx={{ 
          p: 2.5, 
          background: 'linear-gradient(135deg, #ec4899 0%, #db2777 100%)',
          borderRadius: 0,
          boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
          border: '2px solid rgba(255,255,255,0.3)',
          textAlign: 'center',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.95)', fontSize: 13, fontWeight: 600, mb: 0.5 }}>
            Total Containers in {year}
          </Typography>
          <Typography sx={{ color: 'white', fontSize: { xs: 36, md: 44 }, fontWeight: 900, lineHeight: 1 }}>
            {totalContainers}
          </Typography>
        </Paper>
      </Box>

      {/* Monthly Bar Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#7c3aed', mb: 2, textAlign: 'center' }}>
          📊 Monthly Breakdown
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: '2px solid #e9d5ff',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)',
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, monthlyData.length * 80), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="month" 
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
                  formatter={(value) => [value, 'Containers']}
                  cursor={{ fill: 'rgba(139, 92, 246, 0.05)' }}
                />
                <Bar dataKey="Containers" fill="#8b5cf6" name="Containers" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1, display: { xs: 'block', md: 'none' } }}>
          Swipe to see all months →
        </Typography>
      </Box>

      {/* Monthly Trend Line */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#ec4899', mb: 2, textAlign: 'center' }}>
          📈 Trend Analysis
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: '2px solid #fecdd3',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          boxShadow: '0 8px 24px rgba(236, 72, 153, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, monthlyData.length * 80), height: { xs: 300, md: 350 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: 10, bottom: 10 }}>
                <defs>
                  <linearGradient id="monthWiseTrend" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
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
                  formatter={(value) => [value, 'Containers']}
                />
                <Area 
                  type="monotone" 
                  dataKey="Containers" 
                  stroke="#ec4899" 
                  strokeWidth={3}
                  fill="url(#monthWiseTrend)"
                  dot={{ fill: '#ec4899', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1, display: { xs: 'block', md: 'none' } }}>
          Swipe to see all months →
        </Typography>
      </Box>
    </Box>
  )
}
