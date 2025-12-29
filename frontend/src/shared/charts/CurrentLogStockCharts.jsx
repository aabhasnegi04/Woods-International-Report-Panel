import { useMemo } from 'react'
import { Box, Paper, Typography, Stack, Grid, Card, CardContent } from '@mui/material'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line } from 'recharts'
import ForestIcon from '@mui/icons-material/Forest'
import InventoryIcon from '@mui/icons-material/Inventory'
import BusinessIcon from '@mui/icons-material/Business'
import LocationOnIcon from '@mui/icons-material/LocationOn'

const COLORS = ['#8B4513', '#D2691E', '#CD853F', '#DEB887', '#F4A460', '#DAA520', '#B8860B', '#228B22', '#32CD32', '#90EE90']

export default function CurrentLogStockCharts({ data }) {
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
      background: 'linear-gradient(180deg, #f0f9ff 0%, #e0f2fe 50%, #e8f5e8 100%)',
      width: '100%',
      mx: 0
    }}>
      {/* Header */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 50%, #CD853F 100%)',
        py: { xs: 3, md: 4 },
        px: 2,
        mb: 3,
        borderRadius: 0,
        boxShadow: '0 8px 32px rgba(139, 69, 19, 0.4)'
      }}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="center">
          <ForestIcon sx={{ fontSize: { xs: 36, md: 48 }, color: 'white' }} />
          <Typography variant="h5" sx={{ fontWeight: 900, color: 'white', fontSize: { xs: '1.75rem', md: '2.5rem' } }}>
            Current Log Stock
          </Typography>
        </Stack>
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.95)', fontSize: { xs: 13, md: 15 }, mt: 1 }}>
          Uncut log inventory analysis by forest and quality
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, px: 0 }}>
        <Grid container spacing={2} sx={{ maxWidth: 900 }}>
          <Grid item xs={12} md={4}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #8B4513 0%, #A0522D 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(139, 69, 19, 0.3)',
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
              background: 'linear-gradient(135deg, #CD853F 0%, #DEB887 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(205, 133, 63, 0.3)',
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
              background: 'linear-gradient(135deg, #228B22 0%, #32CD32 100%)',
              color: 'white',
              borderRadius: 0,
              boxShadow: '0 8px 24px rgba(34, 139, 34, 0.3)',
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
                <ForestIcon sx={{ fontSize: 48, mb: 1.5, opacity: 0.9 }} />
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
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#8B4513', mb: 2, textAlign: 'center' }}>
            🌲 Forest-wise CBM Analysis
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none', 
            overflowX: 'auto', 
            overflowY: 'hidden', 
            WebkitOverflowScrolling: 'touch',
            background: 'linear-gradient(135deg, #fef7ed 0%, #fed7aa 100%)',
            boxShadow: '0 8px 24px rgba(139, 69, 19, 0.2)',
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
                    cursor={{ fill: 'rgba(139, 69, 19, 0.05)' }}
                  />
                  <Bar dataKey="CBM Bordereau" fill="#8B4513" name="CBM Bordereau" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="Actual CBM" fill="#CD853F" name="Actual CBM" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
          <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
            {forestSummaryData.length} forests • CBM Bordereau vs Actual CBM comparison
          </Typography>
        </Box>
      </Box>

      {/* Forest Log Count Pie Chart */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Box sx={{ width: '100%' }}>
          <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#CD853F', mb: 2, textAlign: 'center' }}>
            📊 Log Count Distribution by Forest
          </Typography>
          <Paper sx={{ 
            p: 0, 
            borderRadius: 0, 
            border: 'none',
            background: 'linear-gradient(135deg, #fff8f1 0%, #ffedd5 100%)',
            boxShadow: '0 8px 24px rgba(205, 133, 63, 0.2)',
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
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#228B22', mb: 2, textAlign: 'center' }}>
          🌍 Forest & Origin CBM Analysis (Top 10)
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
          boxShadow: '0 8px 24px rgba(34, 139, 34, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(800, forestOriginData.length * 80), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forestOriginData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                <defs>
                  <linearGradient id="forestOriginGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#228B22" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#32CD32" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                />
                <Area 
                  type="monotone" 
                  dataKey="CBM Bordereau" 
                  stroke="#228B22" 
                  strokeWidth={3}
                  fill="url(#forestOriginGradient)"
                  dot={{ fill: '#228B22', r: 4, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: 'white' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Top {forestOriginData.length} forest-origin combinations by CBM Bordereau
        </Typography>
      </Box>

      {/* Forest & AAC Classification */}
      <Box sx={{ mb: 3, px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#D2691E', mb: 2, textAlign: 'center' }}>
          🏷️ Forest & AAC Classification
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
          boxShadow: '0 8px 24px rgba(210, 105, 30, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, forestAACData.length * 100), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forestAACData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  tick={{ fontSize: 9, fill: '#64748b' }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
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
                />
                <Line 
                  type="monotone" 
                  dataKey="Log Count" 
                  stroke="#D2691E" 
                  strokeWidth={3}
                  dot={{ fill: '#D2691E', r: 5, strokeWidth: 2, stroke: 'white' }}
                  activeDot={{ r: 7, strokeWidth: 2, stroke: 'white' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          Log count distribution across forest AAC classifications
        </Typography>
      </Box>

      {/* Company & Certificate Analysis */}
      <Box sx={{ px: 0 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#B8860B', mb: 2, textAlign: 'center' }}>
          🏢 Company & Certificate Analysis
        </Typography>
        <Paper sx={{ 
          p: 0, 
          borderRadius: 0, 
          border: 'none',
          overflowX: 'auto',
          overflowY: 'hidden',
          WebkitOverflowScrolling: 'touch',
          background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
          boxShadow: '0 8px 24px rgba(184, 134, 11, 0.2)',
          outline: 'none',
          '&:focus': { outline: 'none' },
          '&:focus-visible': { outline: 'none' }
        }}>
          <Box sx={{ width: Math.max(600, companyCertificateData.length * 120), height: { xs: 350, md: 400 }, minWidth: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={companyCertificateData} margin={{ top: 10, right: 10, left: 10, bottom: 40 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis 
                  dataKey="name" 
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
                  cursor={{ fill: 'rgba(184, 134, 11, 0.05)' }}
                />
                <Bar dataKey="Log Count" fill="#B8860B" name="Log Count" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
        <Typography sx={{ fontSize: 11, color: '#94a3b8', textAlign: 'center', mt: 1 }}>
          {companyCertificateData.length} companies • Log count by company
        </Typography>
      </Box>
    </Box>
  )
}