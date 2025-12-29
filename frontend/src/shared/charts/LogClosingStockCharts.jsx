import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Grid, Card, CardContent } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts'
import InventoryIcon from '@mui/icons-material/Inventory'
import BusinessIcon from '@mui/icons-material/Business'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const COLORS = ['#64748b', '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#f97316', '#ec4899']

export default function LogClosingStockCharts({ data }) {
  // Process Forest Summary data (recordset 1) - Main forest breakdown
  const forestSummaryData = useMemo(() => {
    if (!data?.recordsets?.[1]) return []
    return data.recordsets[1]
      .filter(item => item.FOREST && item.FOREST !== 'GRAND TOTAL')
      .map(item => ({
        name: item.FOREST,
        'Log Count': item.LOG_COUNT || 0,
        'CBM Bordereau': parseFloat(item.CBM_BORDEREAU || 0),
        'Actual CBM': parseFloat(item.BORD_ACTUAL_CBM || 0)
      }))
      .sort((a, b) => b['CBM Bordereau'] - a['CBM Bordereau'])
  }, [data])

  // Process Forest & Origin data (recordset 2) - Origin breakdown
  const forestOriginData = useMemo(() => {
    if (!data?.recordsets?.[2]) return []
    return data.recordsets[2]
      .filter(item => item.FOREST && item.FOREST !== 'GRAND TOTAL')
      .slice(0, 10) // Limit to top 10 for readability
      .map(item => ({
        name: `${item.FOREST} - ${item.ORIGIN || 'Unknown'}`,
        forest: item.FOREST,
        origin: item.ORIGIN || 'Unknown',
        'Log Count': item.LOG_COUNT || 0,
        'CBM Bordereau': parseFloat(item.CBM_BORDEREAU || 0),
        'Actual CBM': parseFloat(item.BORD_ACTUAL_CBM || 0)
      }))
      .sort((a, b) => b['CBM Bordereau'] - a['CBM Bordereau'])
  }, [data])

  // Process Forest & AAC data (recordset 3) - AAC classification
  const forestAACData = useMemo(() => {
    if (!data?.recordsets?.[3]) return []
    return data.recordsets[3]
      .filter(item => item.FOREST && item.FOREST !== 'GRAND TOTAL')
      .map(item => ({
        name: `${item.FOREST} - ${item.AAC || 'N/A'}`,
        forest: item.FOREST,
        aac: item.AAC || 'N/A',
        'Log Count': item.LOG_COUNT || 0,
        'CBM Bordereau': parseFloat(item.CBM_BORDEREAU || 0),
        'Actual CBM': parseFloat(item.BORD_ACTUAL_CBM || 0)
      }))
      .sort((a, b) => b['CBM Bordereau'] - a['CBM Bordereau'])
  }, [data])

  // Process Company & Certificate data (recordset 5) - Company breakdown
  const companyCertificateData = useMemo(() => {
    if (!data?.recordsets?.[5]) return []
    return data.recordsets[5]
      .filter(item => item.COMPANY && item.COMPANY !== 'GRAND TOTAL')
      .map(item => ({
        name: item.COMPANY,
        certificate: item.CERTIFICATE || 'N/A',
        'Log Count': item.LOG_COUNT || 0,
        'CBM Bordereau': parseFloat(item.CBM_BORDEREAU || 0),
        'Actual CBM': parseFloat(item.BORD_ACTUAL_CBM || 0)
      }))
      .sort((a, b) => b['CBM Bordereau'] - a['CBM Bordereau'])
  }, [data])

  // Calculate totals from Forest Summary (recordset 1)
  const totals = useMemo(() => {
    const grandTotal = data?.recordsets?.[1]?.find(item => item.FOREST === 'GRAND TOTAL')
    return {
      totalLogs: grandTotal?.LOG_COUNT || 0,
      totalBordereau: parseFloat(grandTotal?.CBM_BORDEREAU || 0).toFixed(2),
      totalActual: parseFloat(grandTotal?.BORD_ACTUAL_CBM || 0).toFixed(2)
    }
  }, [data])

  return (
    <Box sx={{ 
      pb: 2,
      background: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #64748b 0%, #475569 50%, #334155 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(100, 116, 139, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <CalendarTodayIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Log Closing Stock
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Historical log inventory as on specific date
        </Typography>
        {data?.metadata?.fromDate && (
          <Box sx={{ 
            mt: 2, 
            pt: 2, 
            borderTop: '2px solid rgba(255,255,255,0.3)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 16, md: 18 }, 
              fontWeight: 700,
              background: 'rgba(255,255,255,0.2)',
              px: 3,
              py: 1,
              borderRadius: 2
            }}>
              📅 As On: {data.metadata.fromDate}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, px: 0 }}>
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(100, 116, 139, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <InventoryIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totals.totalLogs.toLocaleString()}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Total Logs
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(99, 102, 241, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <BusinessIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totals.totalBordereau}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  CBM Bordereau
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(16, 185, 129, 0.3)',
              height: 160,
              minHeight: 160,
              maxHeight: 160,
              width: '100%',
              display: 'flex',
              alignItems: 'center'
            }}>
              <CardContent sx={{ 
                textAlign: 'center', 
                py: 3, 
                px: 3,
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                height: '100%',
                minWidth: 200,
                '&:last-child': { pb: 3 }
              }}>
                <LocationOnIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
                <Typography variant="h3" sx={{ 
                  fontWeight: 900, 
                  mb: 1, 
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  lineHeight: 1,
                  minHeight: '2.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {totals.totalActual}
                </Typography>
                <Typography variant="body1" sx={{ 
                  opacity: 0.9, 
                  textAlign: 'center',
                  fontSize: '1rem',
                  fontWeight: 600,
                  whiteSpace: 'nowrap'
                }}>
                  Actual CBM
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Forest Summary Chart - Main forest breakdown */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#475569', mb: 2, textAlign: 'center' }}>
            🌲 Forest-wise CBM Analysis (Historical)
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            boxShadow: '0 8px 24px rgba(100, 116, 139, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ width: Math.max(600, forestSummaryData.length * 120), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={forestSummaryData} margin={{ top: 20, right: 20, left: 20, bottom: 70 }} barGap={4} barCategoryGap="15%">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    interval={0}
                  />
                  <YAxis 
                    stroke="#374151" 
                    tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                    tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                    axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                    width={60}
                    domain={[0, 'dataMax + 10']}
                  />
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 12,
                      padding: '10px 14px',
                      textAlign: 'center'
                    }}
                    cursor={{ fill: 'rgba(205, 133, 63, 0.05)' }}
                  />
                  <Bar dataKey="CBM Bordereau" fill="#64748b" name="CBM Bordereau" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Actual CBM" fill="#6366f1" name="Actual CBM" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            {forestSummaryData.length} forests • Historical CBM comparison
          </Typography>
        </Box>
      </Box>

      {/* Forest Log Count Pie Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#6366f1', mb: 2, textAlign: 'center' }}>
            📊 Historical Log Distribution by Forest
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none',
            background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
            boxShadow: '0 8px 24px rgba(99, 102, 241, 0.15)',
            outline: 'none',
            '&:focus': { outline: 'none' },
            '&:focus-visible': { outline: 'none' }
          }}>
            <Box sx={{ height: { xs: 350, md: 400 }, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={forestSummaryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="Log Count"
                  >
                    {forestSummaryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip 
                    contentStyle={{ 
                      background: 'white', 
                      border: '1px solid #e2e8f0',
                      borderRadius: 8,
                      fontSize: 12,
                      textAlign: 'center'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Box>
      </Box>

      {/* Forest & Origin Analysis */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#10b981', mb: 2, textAlign: 'center' }}>
          🌍 Forest & Origin Historical Analysis (Top 10)
        </Typography>
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
          boxShadow: '0 8px 24px rgba(16, 185, 129, 0.15)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(800, forestOriginData.length * 80), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forestOriginData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                <defs>
                  <linearGradient id="logClosingGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  stroke="#374151" 
                  tick={{ fontSize: 11, fill: '#374151', fontWeight: 600 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  interval={0}
                />
                <YAxis 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  width={60}
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
                />
                <Area 
                  type="monotone" 
                  dataKey="CBM Bordereau" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#logClosingGradient)"
                  dot={{ fill: '#10b981', r: 4, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Top {forestOriginData.length} forest-origin combinations by historical CBM
        </Typography>
      </Box>

      {/* Company & Certificate Analysis */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#64748b', mb: 2, textAlign: 'center' }}>
          🏢 Company & Certificate Historical Analysis
        </Typography>
        <Paper sx={{ 
          p: { xs: 1.5, sm: 2 }, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          boxShadow: '0 8px 24px rgba(100, 116, 139, 0.15)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, companyCertificateData.length * 120), height: { xs: 400, md: 450 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyCertificateData} margin={{ top: 20, right: 20, left: 20, bottom: 80 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  interval={0}
                />
                <YAxis 
                  stroke="#374151" 
                  tick={{ fontSize: 12, fill: '#374151', fontWeight: 600 }}
                  tickLine={{ stroke: '#374151', strokeWidth: 1 }}
                  axisLine={{ stroke: '#374151', strokeWidth: 2 }}
                  width={60}
                  domain={[0, 'dataMax + 10']}
                />
                <RechartsTooltip 
                  contentStyle={{ 
                    background: 'white', 
                    border: '2px solid #e2e8f0',
                    borderRadius: 8,
                    fontSize: 13,
                    padding: '12px 16px',
                    fontWeight: 600
                  }}
                  cursor={{ fill: 'rgba(100, 116, 139, 0.05)' }}
                />
                <Bar dataKey="Log Count" fill="#64748b" name="Log Count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          {companyCertificateData.length} companies • Historical log count by company
        </Typography>
      </Box>
    </Box>
  )
}