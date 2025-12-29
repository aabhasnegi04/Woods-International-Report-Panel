import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Chip } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area } from 'recharts'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import TrendingDownIcon from '@mui/icons-material/TrendingDown'
import LocalShippingIcon from '@mui/icons-material/LocalShipping'

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#f97316', '#84cc16']

export default function ContainerLoadingCharts({ data }) {
  const clientData = useMemo(() => {
    if (!data?.recordsets?.[0]) return []
    return data.recordsets[0]
      .filter(item => item.Client_Name)
      .map(item => ({
        name: item.Client_Name || 'Unknown',
        shortName: (item.Client_Name || 'Unknown').length > 15 ? 
          (item.Client_Name || 'Unknown').substring(0, 15) + '...' : 
          (item.Client_Name || 'Unknown'),
        'Current Month': item.MTD_CONTAINER || 0,
        'Previous Month': item.PREVMONTH_CONTAINER || 0
      }))
      .sort((a, b) => b['Current Month'] - a['Current Month'])
  }, [data])

  const monthlyData = useMemo(() => {
    if (!data?.recordsets?.[1]) return []
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
    const mapped = data.recordsets[1].map(item => {
      const monthStr = (item.MONTHS || item.LOADING_MONTH || '').substring(0, 3)
      return {
        month: monthStr,
        'Containers': item.NO_OF_CONTAINER_2025 || 0,
        monthOrder: monthOrder[monthStr] || 99
      }
    })
    return mapped.sort((a, b) => a.monthOrder - b.monthOrder)
  }, [data])

  const totalMTD = useMemo(() => clientData.reduce((sum, item) => sum + item['Current Month'], 0), [clientData])
  const totalPrev = useMemo(() => clientData.reduce((sum, item) => sum + item['Previous Month'], 0), [clientData])
  const growth = useMemo(() => {
    if (totalPrev === 0) return 0
    return (((totalMTD - totalPrev) / totalPrev) * 100).toFixed(1)
  }, [totalMTD, totalPrev])
  
  const isPositive = parseFloat(growth) >= 0
  const top5Clients = clientData.slice(0, 5)

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #fef3c7 0%, #fef9e7 50%, #f0fdf4 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 50%, #ef4444 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <LocalShippingIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Container Loading
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Client-wise performance overview
        </Typography>
      </Box>

      {/* Chart 1: Client Name - MTD vs Previous Month */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#7c3aed', mb: 2, textAlign: 'center' }}>
          👥 Client-wise: MTD vs Previous Month Containers
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none', 
          overflowX: 'auto', 
          overflowY: 'hidden', 
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #faf5ff 0%, #fce7f3 100%)',
          boxShadow: '0 8px 24px rgba(124, 58, 237, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, clientData.length * 90), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={clientData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }} barGap={4} barCategoryGap="15%">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="shortName" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 10, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={50}
                  tickLine={false}
                  interval={0}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
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
                  labelFormatter={(label, payload) => payload?.[0]?.payload?.name || label}
                  cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }}
                />
                <Bar dataKey="Current Month" fill="#8b5cf6" name="Current Month" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Previous Month" fill="#f472b6" name="Previous Month" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          {clientData.length} clients total • Swipe to see more →
        </Typography>
      </Box>

      {/* Chart 2: Loading Month - No of Container 2025 */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#dc2626', mb: 2, textAlign: 'center' }}>
          📈 Loading Month - No. of Containers 2025
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
          boxShadow: '0 8px 24px rgba(239, 68, 68, 0.2)',
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
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 11, fill: '#64748b' }}
                  tickLine={false}
                  width={40}
                  domain={[0, 'dataMax + 10']}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '1px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 12
                  }}
                  formatter={(value) => [value, 'Containers']}
                />
                <Bar dataKey="Containers" fill="#ef4444" name="Containers" radius={[6, 6, 0, 0]} />
              </BarChart>
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
